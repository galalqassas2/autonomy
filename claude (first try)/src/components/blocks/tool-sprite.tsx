import { tools } from "@/lib/tools"

/*
  Every brand mark defined once as a symbol. Tiles reference them with
  <use>, so 58 marks ship as markup a single time rather than per tile,
  and none of the path data reaches the client bundle.
*/
export function ToolSprite() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {tools.map((tool) => (
          <symbol
            key={tool.slug}
            id={`tool-${tool.slug}`}
            viewBox={tool.viewBox}
            dangerouslySetInnerHTML={{ __html: tool.body }}
          />
        ))}
      </defs>
    </svg>
  )
}
