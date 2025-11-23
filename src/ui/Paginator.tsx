import { React } from "@finds"

window.registerStyles({
    "paginator-page-selected": { background: "rgba(0, 0, 248, 0.23)" },
    "paginator-page": { display: "inline-block", background: "rgb(0 0 0 / 10%)", width: "32px", height: "24px", fontSize: "16px", fontWeight: "bold", borderRight: "1px solid gray", textAlign: "center", verticalAlign: "middle", "userSelect": "none" },
});

export interface PaginatorProps {
    pageAmount: number;
    onClickPage: (page: number) => void;
    selectedPage: number;
}

export function Paginator(props: PaginatorProps) {
    return (
        <div>
            {Array.from({ length: props.pageAmount }, (_, i) => i).map(page => (
                <span onClick={_ => props.onClickPage(page)} className={"paginator-page " + (page == props.selectedPage ? " paginator-page-selected" : "")}>{page + 1}</span>
            ))}
        </div>
    )
}