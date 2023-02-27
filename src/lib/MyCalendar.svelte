<script context="module">
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
</script>

<script>
	let loading = false;
	/** @type {(s: Date, e: Date) => string} */
	export let getUrl;
	/**
	 *
	 * @param {string | null} type
	 */
	function getColorFromType(type) {
		switch (type) {
			case 'CM':
				return 'yellow';
			case 'CI':
				return 'lime';
			case 'TD':
				return 'cyan';
			case 'SCOLARITE':
			case 'ENSEIGNANTS':
				return 'red';
			case 'TP':
				return 'lightgray';
			default:
				return '';
		}
	}
	/**
	 *
	 * @param {{start: Date, end: Date}} fetchInfo
	 * @param {(_: any[]) => void} successCallback
	 */
	function fetchEvents(fetchInfo, successCallback) {
		let { start, end } = fetchInfo;
		start = new Date(start);
		start.setDate(start.getDate() + 1);
		end = new Date(end);
		loading = true;
		fetch(getUrl(start, end))
			.then((r) => r.json())
			.then((d) => {
				/** @type import('$lib/types.d').PlanningOfDay[]*/
				const plannings = d;
				const events = [];
				for (const planning of plannings) {
					for (const ev of planning.events) {
						events.push({
							id: ev.description.id,
							start: new Date(ev.start),
							end: new Date(ev.end),
							titleHTML: `<span class="title-bold">${ev.summary}</span><br>${
								ev.location?.replaceAll(',', '<br>') ?? ''
							}`,
							color: getColorFromType(ev.description.type),
							extendedProps: {
								type: ev.description.type
							}
						});
					}
				}
				loading = false;
				let el = document.querySelector('.ec-toolbar > *:nth-child(2)');
				if (el !== null && el instanceof HTMLElement) {
					const [hours, minutes] = plannings.reduce(
						(prev, cur) => {
							const [h, m] = prev;
							const [dh, dm] = cur.events.reduce(
								(p, c) => {
									let [oldH, oldM] = p;
									const dt = new Date(new Date(c.end).getTime() - new Date(c.start).getTime());
									oldM += dt.getUTCMinutes();
									oldH += dt.getUTCHours() + Math.floor(oldM / 60);
									return [oldH, oldM % 60];
								},
								[0, 0]
							);

							return [h + dh + Math.floor(dm / 60), dm % 60];
						},
						[0, 0]
					);
					el.innerText = `${hours}h` + (minutes ? `${minutes}m` : "");
				}
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

	let plugins = [TimeGrid];
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
		eventMouseLeave: removeTooltip
	};

	/** @type {{setOption: (_: string, d: any) => void} | undefined} */
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
			if (ev.key === 'ArrowLeft') window.document.querySelector('.ec-button.ec-prev')?.click();
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
</script>

{#if loading}
	<div id="overlay">Page loading...</div>
{/if}
<svelte:window on:keydown={handleKeydown} />
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
