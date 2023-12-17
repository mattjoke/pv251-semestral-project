<script lang="ts">
    import {dataLoadingState, repoStore, dataStore} from "$lib/stores/stores.js";
    import {isInvalidLink} from "$lib/utils.js";
    import {LoadingState} from "$lib/objects/loadingState";

    let repoLink = '';
    const updateStore = async () => {
        if (isInvalidLink(repoLink)) {
            return;
        }
        repoStore.set(repoLink);
        dataLoadingState.set(LoadingState.LOADING);
        try {
            const response = await fetch('/api/fetch');
            const data = await response.json();
            console.log(data.data)
            dataStore.set(data.data)
            dataLoadingState.set(LoadingState.SUCCESS);
        } catch (e) {
            dataLoadingState.set(LoadingState.ERROR);
        }
    }
</script>

<form on:submit={updateStore}>
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
        <input type="search" id="default-search"
               class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               placeholder="Git repo link" required
               on:change={e => repoLink = e.target.value}
        >
        <button type="submit"
                class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </button>
    </div>
</form>