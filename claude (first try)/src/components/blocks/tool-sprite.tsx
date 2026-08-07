import { TOOL_MARKS } from "@/lib/tools/marks"

/*
  Every brand mark defined once as a <symbol>. Tiles reference them with
  <use>, so the artwork ships as markup a single time however many tiles are
  on screen, and none of it reaches the client bundle.
*/
export function ToolSprite() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {Object.entries(TOOL_MARKS).map(([slug, mark]) => (
          <symbol
            key={slug}
            id={`tool-${slug}`}
            viewBox={mark.viewBox}
            dangerouslySetInnerHTML={{ __html: mark.body }}
          />
        ))}
      </defs>
    </svg>
  )
}
