import { SharpCanvasElement } from "./canvas";
import { GraphData, GraphDataElement } from "../graph_data";
import { GraphDataState } from "../graph_data_state";
import { GraphElement } from "./graph";

export class LineGraphDataState extends GraphDataState {
    constructor(parent: GraphDataState) {
        super(parent.data, parent.index);
    }

    draw(
        c: CanvasRenderingContext2D,
        minX: number,
        maxX: number,
        maxAmount: number
    ) {
        const width = c.canvas.width;
        const height = c.canvas.height;
        // throw new Error("draw() function not implemented.");
    }
}

export class LineGraphElement extends GraphElement {
    states: LineGraphDataState[] = [];
    observer: MutationObserver;
    canvas: SharpCanvasElement;

    /** Returns the total length of the attached graph states. */
    get stateLength(): number {
        return this.states.length;
    }

    attach(data: GraphData) {
        const index = this.stateLength;
        const state = new LineGraphDataState(data.createState(index));
        state.data.addListener((value) => { // Called when a value updates.
            console.log(state.data.key + " = " + value);
        });

        this.states.push(state);
    }

    detech(data: GraphData) {
        this.states = this.states.filter(state => state.data !== data);
    }

    draw(c: CanvasRenderingContext2D, r: DOMRect) {
        if (this.stateLength < 1) {
            throw new Error("The attached graph-data states for a line must be at least one.");
        }

        const lineGap = r.width / this.stateLength;

        c.beginPath();
        c.strokeStyle = "rgb(0, 100, 255)";
        c.lineWidth = 3;
        c.lineCap = "round";
        c.lineJoin = "round";
        c.moveTo(15, 15);
        c.lineTo((r.width / 2) - 15, r.height - 15);
        c.lineTo(r.width - 15, r.height / 2)
        c.stroke();
    }

    createCanvas(): SharpCanvasElement {
        const canvas = document.createElement("sharp-canvas") as SharpCanvasElement;
        canvas.style.width  = this.getAttribute("width")  ?? "100%";
        canvas.style.height = this.getAttribute("height") ?? "250px";

        // Why arrow function wrapping is to allow these member variables to be
        // referenced scope the [this.draw] function.
        canvas.draw = (c, r) => this.draw(c, r);

        return canvas;
    }

    disconnectedCallback() {
        this.observer.disconnect();
    }

    connectedCallback() {
        // A init-state function is provided to attach graph-data state
        // directly from script without initializing the graph-data state through
        // the initial HTML element.
        //
        let initStateFunc = this.getAttribute("initstate")
                         ?? this.getAttribute("initState");

        if (initStateFunc != null) {
            (new Function(initStateFunc))(); // for initialize graph datas.
        }

        this.style.display = "flex";

        const shadow = this.attachShadow({ mode: "open" });
              shadow.appendChild(this.canvas = this.createCanvas());

        // Initializes all graph-data state by iterating over children
        // in this element.
        //
        // See also: All children must be <graph-data> elements.
        //
        for (const child of this.children) {
            if (child instanceof GraphDataElement == false) {
                throw "All children of graph elements must only <graph-data> elements defined.";
            }

            this.attach(child.data);
        }

        this.observer = new MutationObserver((records, _) => {
            const _handleAttached = (target: GraphDataElement) => {
                if (target instanceof GraphDataElement == false) {
                    throw new Error("The element attached to this element is not a <graph-data> element.");
                }

                this.attach(target.data);
            }

            const _handleDetached = (target: GraphDataElement) => {
                if (target instanceof GraphDataElement == false) {
                    throw new Error("The element detached to this element is not a <graph-data> element.");
                }

                this.detech(target.data);
            }

            for (const record of records) {
                const attached = record.addedNodes;
                const detached = record.removedNodes;

                if (attached.length != 0) attached.forEach(_handleAttached);
                if (detached.length != 0) detached.forEach(_handleDetached);
            }
        });

        this.observer.observe(this, {childList: true})
    }
}

customElements.define("line-graph", LineGraphElement);