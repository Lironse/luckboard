<script lang="ts">
	import * as Table from "$lib/components/ui/table/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.ts";
	import { writable } from "svelte/store";
	import { Input } from "$lib/components/ui/input/index.js";
	import { onMount } from "svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { name } from "./stores";
	import { get } from "svelte/store";

	let leaderboard = writable([
		{
			name: "",
			streak: 0,
			best: 0,
		},
	]);

	let nameInput = "";

	onMount(async () => {
		const response = await fetch("/api/leaderboard");
		if (!response.ok) {
			// TODO: handle error
			return;
		}

		const data = await response.json();
		leaderboard.set(data.leaderboard);
	});

	let streak = writable(0);
	let dialogTitle: string = "Starting fight...";

	async function startFight() {
		dialogTitle = "Starting fight...";
		try {
			const response = await fetch("/api/fight", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: get(name),
				}),
			});

			if (!response.ok) {
				// TODO: handle error
				return;
			}

			const data = await response.json();
			data.won == true ? handleWin() : handleLoss();
			streak.set(data.streak);
		} catch (e) {
			console.log("error starting fight:", e);
		}
	}

	function handleWin() {
		dialogTitle = "You WON!";
	}

	function handleLoss() {
		dialogTitle = "You LOST!";
	}

	function saveName() {
		name.set(nameInput);
	}
</script>

<div id="body" class="w-screen h-screen flex flex-col items-center gap-32 pt-8">
	<div>
		<h2
			class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
		>
			{#if $name}
				Welcome, {$name}!
			{:else}
				Please choose a name.
			{/if}
		</h2>
		<div id="edit-name" class="flex flex-row gap-2">
			<Input
				bind:value={nameInput}
				type="text"
				placeholder="edit name"
				class="max-w-xs"
			/>
			<Button on:click={saveName}>save</Button>
		</div>
	</div>

	<div id="leaderboard">
		<Table.Root>
			<Table.Caption
				>A list of the luckiest people yet. Refresh to
				update.</Table.Caption
			>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]"
						>Rank</Table.Head
					>
					<Table.Head>Name</Table.Head>
					<Table.Head class="text-right"
						>Streak</Table.Head
					>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each $leaderboard as entry, i}
					<Table.Row>
						<Table.Cell class="font-medium"
							>{i + 1}</Table.Cell
						>
						<Table.Cell class=""
							>{entry.name}</Table.Cell
						>
						<Table.Cell class="text-right"
							>{entry.best}</Table.Cell
						>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div id="current-streak flex flex-row">
		<p>STREAK: {$streak}</p>
	</div>
	<div id="fight-button">
		<Dialog.Root>
			<Dialog.Trigger
				class={buttonVariants({ variant: "default" })}
				on:click={startFight}>FIGHT</Dialog.Trigger
			>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title
						>{dialogTitle}</Dialog.Title
					>
					<Dialog.Description>
						remember, the result is
						completely random.
					</Dialog.Description>
				</Dialog.Header>
			</Dialog.Content>
		</Dialog.Root>
	</div>
</div>
