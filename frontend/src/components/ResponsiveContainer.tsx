import "./ResponsiveContainer.css";

export function ResponsiveContainer({children}: React.PropsWithChildren){
    return (
        <div className="responsive-container">{children}</div>
    )
}