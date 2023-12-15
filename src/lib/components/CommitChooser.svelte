<script>
    import {Button, Modal, Tooltip} from "flowbite-svelte";
    import {dataStore, selectedCommitsStore} from "$lib/stores/stores.js";

    let defaultModal = false;

    let selectedCommits = [];
    selectedCommitsStore.subscribe(value => {
        selectedCommits = value;
    });
    let allCommits = [];
    dataStore.subscribe(value => {
        allCommits = value.commits;
    });
</script>

<div class="flex flex-col">
    <p class="text-xl mt-5">Commit Timeline</p>
    <button type="button" on:click={() => defaultModal = true}
            class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">
        Change Range
    </button>
    <Modal title="Change commit timeline" bind:open={defaultModal}>
        <div class="grid grid-cols-5">
            <div class="col-span-1">
                <!--'<'-->
                <div class="flex flex-col justify-center items-center">
                    <button type="button"
                            class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">
                        &lt;
                    </button>
                </div>
                <Tooltip>Move 25 commits to left</Tooltip>
            </div>
            <div class="col-span-3">
                <div class="flex flex-row">

                </div>
            </div>
            <div class="col-span-1">
                <!--'>'-->
                <div class="flex flex-col justify-center items-center">
                    <button type="button"
                            class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">
                        &gt;
                    </button>
                </div>
                <Tooltip>Move 25 commits to right</Tooltip>
            </div>
        </div>
        <div class="w-full flex flex-row justify-center">
            <Button class="bg-green-500" on:click={() => alert('Handle "success"')}>Update</Button>
        </div>
    </Modal>
</div>