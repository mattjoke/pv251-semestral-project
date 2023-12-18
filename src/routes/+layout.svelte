<script>
    import {browser} from '$app/environment';
    import {page} from '$app/stores';
    import {webVitals} from '$lib/vitals';

    import "../app.css";
    import RepoInput from "$lib/components/RepoInput.svelte";
    import {Navbar, NavBrand} from "flowbite-svelte";

    /** @type {import('./$types').LayoutServerData} */
    export let data;

    $: if (browser && data?.analyticsId) {
        webVitals({
            path: $page.url.pathname,
            params: $page.params,
            analyticsId: data.analyticsId
        });
    }
</script>

<div class="p-0 m-0 w-screen h-screen ">
    <div class="flex flex-col justify-between h-full">
        <Navbar rounded color="form">
            <NavBrand href="/?">
                <img src="/logo.svg" class="me-3 h-5 sm:h-5" alt="LogGit Logo"/>
                <span class="self-center whitespace-nowrap text-xl font-semibold">LogGit</span>
            </NavBrand>
            <div class="md:w-1/3 w-9/12 invisible">
                <RepoInput/>
            </div>
        </Navbar>

        <main class="h-full w-full">
            <slot/>
        </main>

        <div class="w-full drop-shadow-md">
            <footer class="flex justify-center p-5">
                <p>
                    Created by <a class="underline" href="https://matejhakos.eu.org">Matej Hakoš</a>, 2023
                </p>
            </footer>
        </div>
    </div>
</div>