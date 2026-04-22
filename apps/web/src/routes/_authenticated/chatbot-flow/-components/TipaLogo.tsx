interface TipaLogoProps {
  className?: string;
}

export function TipaLogo({ className }: TipaLogoProps) {
  return (
    <img
      className={className}
      src={`${import.meta.env.BASE_URL}images/chatbot/tipa-logo.png`}
      alt="TIPA logo"
      draggable={false}
    />
  );
}
