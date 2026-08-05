/*
  Vertical word spinner. Takes four words and repeats the first so the loop
  closes without a jump. Ported off styled-components onto plain CSS.
*/
export function WordCycle({ words }: { words: [string, string, string, string] }) {
  return (
    <>
      <span aria-hidden="true" className="word-cycle">
        {[...words, words[0]].map((word, i) => (
          <b key={i}>{word}</b>
        ))}
      </span>
      <span className="sr-only">{words.join(", ")}</span>
    </>
  )
}
