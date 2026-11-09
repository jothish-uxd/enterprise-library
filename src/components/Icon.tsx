import { type SVGProps } from 'react';
import { ICONS, type IconName } from '../icons/data';

/**
 * Icon — one of the library's outline icons, drawn in the current text colour
 * so it follows ink, dark mode and high contrast. Shapes from Lucide (ISC).
 *
 * - Decorative by default: aria-hidden, because the words beside it say the
 *   same thing. Give it a `label` only when it stands alone and means
 *   something ("Warning"); it's then role="img" with that name. An icon-only
 *   button gets its name from the button, not the icon.
 * - size 'sm' 16px, 'md' 20px (default), 'lg' 24px, or a number of pixels.
 *   The stroke stays the same width at every size.
 * - Plain HTML: dist/icons/svg/NAME.svg, or the sprite:
 *   <svg class="icon"><use href="…/icons/sprite.svg#icon-NAME" /></svg>
 */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: 'sm' | 'md' | 'lg' | number;
  /** Only for an icon that means something on its own */
  label?: string;
}

const PX = { sm: 16, md: 20, lg: 24 } as const;

export function Icon({ name, size = 'md', label, className = '', ...rest }: IconProps) {
  const px = typeof size === 'number' ? size : PX[size];
  return (
    <svg
      className={['icon', typeof size === 'string' && `icon--${size}`, className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      width={px}
      height={px}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      {...rest}
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}

export { ICONS, ICON_GROUPS } from '../icons/data';
export type { IconName } from '../icons/data';
