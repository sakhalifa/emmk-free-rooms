import type { Room } from "$lib/types.d"

type RGB = `rgb(${number}, ${number}, ${number})`
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`
type HEX = `#${string}`
type Color = RGB | RGBA | HEX

type CategoryType = {
	name: string;
	categoryMatcher: (_: string) => boolean;
	color: Color;
	rooms: Room[];
}

export type { CategoryType }