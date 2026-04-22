import {
  StyledAvatarFallback,
  StyledAvatarImage,
  StyledAvatarRoot,
  type StyledAvatarRootProps
} from '#components/Avatar/Avatar.style.ts';
import AvatarFallbackImage from '#assets/profile.png';

export interface AvatarProps extends StyledAvatarRootProps {
  src?: string;
  onClick?: () => void;
}

export const Avatar = ({
  src = AvatarFallbackImage,
  onClick,
  $size = 40
}: AvatarProps) => {
  return (
    <StyledAvatarRoot
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      $size={$size}
    >
      <StyledAvatarImage src={src} alt="Colm Tuite" />
      <StyledAvatarFallback delayMs={600}></StyledAvatarFallback>
    </StyledAvatarRoot>
  );
};
