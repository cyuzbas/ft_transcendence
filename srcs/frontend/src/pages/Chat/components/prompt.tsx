type Props = {
  promptText: string,
  setPrompt: React.Dispatch<React.SetStateAction<boolean>>
}

export const Prompt = ({ promptText, setPrompt }: Props) => {
  return (
    <div className="chat-popup">
      {promptText}
      <div>
        <button onClick={() => setPrompt(false)}>
          Ok
        </button>
      </div>
    </div>
  )
}
