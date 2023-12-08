<script>
    import {browser} from '$app/environment';
    import {page} from '$app/stores';
    import {webVitals} from '$lib/vitals';

    import "../app.css";
    import RepoInput from "$lib/components/RepoInput.svelte";

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
        <nav class="bg-white border-gray-200 dark:border-gray-600 dark:bg-gray-900 shadow-md">
            <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
                <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
                    <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">LogGit</span>
                    <div class="relative inline-flex items-center justify-center w-max h-max px-2 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <span class="font-medium text-gray-600 dark:text-gray-300">v. 0.0.1</span>
                    </div>
                </a>
                <div class="md:w-1/3 w-9/12 invisible">
                    <RepoInput/>
                </div>
            </div>
        </nav>

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

<style>

</style>
