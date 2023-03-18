<script context="module">
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import ResourceTimeGrid from '@event-calendar/resource-time-grid';
</script>

<script>
	let loading = false;

	/** @type {(s: Date, e: Date) => Promise<import('$lib/types.d').CalendarEvent[]>}*/
	export let fetcher;

	/** @type {{id: string, title: string}[] | undefined}*/
	export let resources;

	resources ??= [];

	/**
	 *
	 * @param {{start: Date, end: Date}} fetchInfo
	 * @param {(_: import('$lib/types.d').CalendarEvent[]) => void} successCallback
	 */
	function fetchEvents(fetchInfo, successCallback) {
		let { start, end } = fetchInfo;
		start = new Date(start);
		start.setDate(start.getDate() + 1);
		end = new Date(end);
		loading = true;
		fetcher(start, end).then((events) => {
			let el = document.querySelector('.ec-toolbar > *:nth-child(2)');
			if (el !== null && el instanceof HTMLElement) {
				const [hours, minutes] = events.reduce(
					(prev, cur) => {
						let [h, m] = prev;
						const dt = new Date(new Date(cur.end).getTime() - new Date(cur.start).getTime());
						const dm = dt.getUTCMinutes();
						const dh = dt.getUTCHours();
						m += dm;
						h += dh + Math.floor(m / 60);
						return [h, m % 60];
					},
					[0, 0]
				);
				el.innerText = `${hours}h` + (minutes ? `${minutes}m` : '');
			}
			loading = false;
			successCallback(events);
		});
	}
	/** @type {HTMLDivElement} */
	let tooltipRef;

	const activeTooltipStyle = {
		position: 'absolute',
		display: 'block',
		width: 'fit-content',
		border: 'solid black 1px',
		borderTopLeftRadius: '5px',
		borderTopRightRadius: '5px',
		zIndex: 999
	};

	let plugins = [TimeGrid, ResourceTimeGrid];
	const mql = window.matchMedia('(max-width: 600px)');
	let options = {
		view: mql.matches ? 'timeGridDay' : 'timeGridWeek',
		allDaySlot: false,
		editable: false,
		width: '100%',
		hiddenDays: [0],
		slotMinTime: '07:00:00',
		slotMaxTime: '21:00:00',
		eventSources: [{ events: fetchEvents }],
		eventMouseEnter: showTooltip,
		eventMouseLeave: removeTooltip,
		resources: resources,
		headerToolbar: { start: 'title', center: '', end: 'today prev,next' }
	};

	/** @type {{setOption: (_: string, d: any) => void, getOption: (_: string) => any | undefined} | undefined} */
	let ec;
	mql.addEventListener('change', (e) => {
		const mobileView = e.matches;
		if (mobileView) {
			ec?.setOption('view', 'timeGridDay');
		} else {
			ec?.setOption('view', 'timeGridWeek');
		}
	});
	/**
	 *
	 * @param {KeyboardEvent} ev
	 */
	function handleKeydown(ev) {
		if (!loading) {
			// @ts-ignore
			if (ev.key === 'ArrowLeft') window.document.querySelector('.ec-button.ec-prev')?.click();
			// @ts-ignore
			if (ev.key === 'ArrowRight') window.document.querySelector('.ec-button.ec-next')?.click();
			if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') removeTooltip({});
		}
	}
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
		// @ts-ignore
		tooltipRef.children[0].style.backgroundColor = info.event.backgroundColor
			? info.event.backgroundColor
			: '#039be5';
		el.addEventListener('pointermove', trackTooltip);
	}

	/**
	 *
	 * @param {{el?: HTMLElement}} info
	 */
	function removeTooltip(info) {
		const { el } = info;
		el?.removeEventListener('pointermove', trackTooltip);
		if (tooltipRef) tooltipRef.style.display = 'none';
	}

	function toggleView() {
		if (ec?.getOption('view') !== 'resourceTimeGridWeek')
			ec?.setOption('view', 'resourceTimeGridWeek');
		else ec?.setOption('view', 'timeGridWeek');
	}
</script>

{#if loading}
	<div id="overlay">Page loading...</div>
{/if}
<svelte:window on:keydown={handleKeydown} />
{#if resources !== undefined && resources.length > 1}
	<div style="width: 100vw; margin: 1em">
		<button class="ec-button" on:click={toggleView}>Toggle Resource View</button>
	</div>
{/if}
<div id="calendar">
	<div class="tooltip" bind:this={tooltipRef}>
		<div class="summary" />
		<div class="content" />
	</div>
	<Calendar {options} {plugins} bind:this={ec} />
</div>

<style>
	#overlay {
		margin: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		position: absolute;
		background-color: rgba(211, 211, 211, 0.5);
		z-index: 999;
		display: flex;
		justify-content: center;
		align-items: center;
	}

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

	#calendar {
		width: 100%;
	}
</style>
