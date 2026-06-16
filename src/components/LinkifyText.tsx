interface LinkifyTextProps {
  text: string;
}

const URL_REGEX = /(https?:\/\/[^\s<]+)/g;

function withLineBreaks(text: string) {
  return text.split('\n').map((line, i) =>
    i > 0 ? (
      <span key={i}>
        <br />
        {line}
      </span>
    ) : (
      line
    )
  );
}

export function LinkifyText({ text }: LinkifyTextProps) {
  if (!text) return null;

  const parts = text.split(URL_REGEX);

  if (parts.length === 1) return <>{withLineBreaks(text)}</>;

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2ECC71] underline hover:brightness-110 transition-all"
          >
            {part}
          </a>
        ) : (
          withLineBreaks(part)
        )
      )}
    </>
  );
}
