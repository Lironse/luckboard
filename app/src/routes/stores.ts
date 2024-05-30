import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const name = writable(browser && (localStorage.getItem("name") || ""))

name.subscribe((value) => {
	browser && localStorage.setItem("name", value || "error");
});

