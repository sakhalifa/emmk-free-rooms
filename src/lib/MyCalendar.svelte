<script context="module">
	import Viewport from 'svelte-viewport-info';
	import { convertDateToISODay } from '$lib/utils';
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
</script>

<script>
	/** @type {(fetchInfo: {start: Date, end: Date}, successCallback: (_: any[]) => void) => void}*/
	export let fetchEvents
	/** @type {HTMLDivElement} */
	let tooltipRef

	const activeTooltipStyle = {
		position: 'absolute',
		display: 'block',
		width: 'fit-content',
		border: 'solid black 1px',
		borderTopLeftRadius: '5px',
		borderTopRightRadius: '5px',
		zIndex: 999
	};

	let plugins = [TimeGrid];
	let options = {
		view: (Viewport?.Width ?? 0) < 500 ? 'timeGridDay' : 'timeGridWeek',
		allDaySlot: false,
		editable: false,
		width: '100%',
		hiddenDays: [0],
		slotMinTime: '07:00:00',
		slotMaxTime: '21:00:00',
		eventSources: [{ events: fetchEvents }],
		eventMouseEnter: showTooltip,
		eventMouseLeave: removeTooltip
	};
	window.addEventListener('keydown', (ev) => {
		if (ev.key === 'ArrowLeft') window.document.querySelector('.ec-button.ec-prev')?.click();
		if (ev.key === 'ArrowRight') window.document.querySelector('.ec-button.ec-next')?.click();
		if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') removeTooltip({});
	});
	// options.datesSet = setEvents;
	/**
	 *
	 * @param {{clientX: number, clientY: number}} ev
	 */
	function trackTooltip(ev) {
		tooltipRef.style.left = `${ev.clientX - tooltipRef.clientWidth / 2}px`;
		tooltipRef.style.top = `${ev.clientY + 20}px`;
	}
	/**
	 *
	 * @param {{el: HTMLElement, event: any, jsEvent: MouseEvent}} info
	 */
	function showTooltip(info) {
		trackTooltip(info.jsEvent);
		const { el, event } = info;
		const content = event.titleHTML.split('<br>');
		tooltipRef.children[0].innerHTML = content[0];
		tooltipRef.children[1].innerHTML = `${event.extendedProps.type ?? 'inconnu'}<br>${content
			.slice(1)
			.join('<br>')}`;
		Object.assign(tooltipRef.style, activeTooltipStyle);
		el.addEventListener('pointermove', trackTooltip);
	}

	/**
	 *
	 * @param {{el?: HTMLElement}} info
	 */
	function removeTooltip(info) {
		const { el } = info;
		el?.removeEventListener('pointermove', trackTooltip);
		tooltipRef.style.display = 'none';
	}
</script>

<div class="tooltip" bind:this={tooltipRef}>
	<div class="summary"></div>
	<div class="content">
	</div>
</div>

<Calendar {options} {plugins} />

<style>
	div.tooltip {
		display: none;
	}

	div.tooltip > div.summary {
		background-color: red;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		width: 15em;
	}

	div.tooltip > div.content {
		background-color: white;
		padding-top: 0.2em;
		padding-bottom: 0.2em;
	}

	div.tooltip > * {
		font-size: small;
		padding-left: 1em;
		padding-right: 1em;
	}
</style>