import { React } from "@finds"

window.registerStyles({
    "paginator-page-selected": { background: "rgba(0, 0, 248, 0.23)" },
    "paginator-page": { display: "inline-block", background: "rgb(0 0 0 / 10%)", width: "32px", height: "24px", fontSize: "16px", fontWeight: "bold", borderRight: "1px solid gray", textAlign: "center", verticalAlign: "middle", "userSelect": "none" },
});

export interface PaginatorProps {
    pages: { label: string; id: string; }[];
    onClickPage: (id: string) => void;
    selectedPageId: string;
}

export function Paginator(props: PaginatorProps) {
    return (
        <div>
            {props.pages.map(page => (
                <span onClick={_ => props.onClickPage(page.id)} className={"paginator-page " + (page.id == props.selectedPageId ? " paginator-page-selected" : "")}>{page.label}</span>
            ))}
        </div>
    )
}