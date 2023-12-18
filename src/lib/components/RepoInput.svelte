<script lang="ts">
    import {advancedOptionsStore, dataLoadingState, dataStore, repoStore} from "$lib/stores/stores.js";
    import {isInvalidLink} from "$lib/utils.js";
    import {LoadingState} from "$lib/objects/loadingState";
    import {fetchData} from "$lib/objects/DataLoader";

    let advancedOptions;
    advancedOptionsStore.subscribe(value => advancedOptions = value);

    let repoLink = '';
    const updateStore = async () => {
        if (repoLink === '') {
            repoLink = "https://github.com/mattjoke/pv251-semestral-project.git"
        }
        if (isInvalidLink(repoLink)) {
            return;
        }
        repoStore.set(repoLink);
        dataLoadingState.set(LoadingState.LOADING);
        try {
            // const response = await fetch('/api/fetch', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         repoLink: repoLink,
            //         branch: advancedOptions.branch,
            //         commits: advancedOptions.commits,
            //     })
            //
            // });
            const response = await fetchData(repoLink, advancedOptions.branch, advancedOptions.commits);
            const data = await response.json();
            if (data.message === "NOK") {
                dataLoadingState.set(LoadingState.ERROR)
                return;
            }
            dataStore.set(data.data)
            dataLoadingState.set(LoadingState.SUCCESS);
        } catch (e) {
            dataLoadingState.set(LoadingState.ERROR);
        }
    }
</script>

<form on:submit={updateStore}>
    <div class="relative">
        <input type="search" id="default-search"
               class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               placeholder="https://github.com/mattjoke/pv251-semestral-project.git"
               bind:value={repoLink}
        >
        <button type="submit"
                class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
            <svg class="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </button>
    </div>
</form>