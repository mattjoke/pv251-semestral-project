<script>
    import {Button, Modal, Tooltip} from "flowbite-svelte";
    import {selectedCommitsStore} from "$lib/stores/stores.js";
    import TimelineDrawer from "$lib/components/TimelineDrawer.svelte";

    let defaultModal = false;

    let selectedCommits = [];
    selectedCommitsStore.subscribe(value => selectedCommits = value);

    const moveCommitsToRight = () => {
        // Get the first and last index of the selected commits, replace selectedCommits with index - 1
        const newLeft = selectedCommits[0] - 1;
        const newRight = selectedCommits[1] - 1;
        selectedCommitsStore.set([newLeft, newRight]);
    }

    const moveCommitsToLeft = () => {
        // Get the first and last index of the selected commits, replace selectedCommits with index + 1)
        const newLeft = selectedCommits[0] + 1;
        const newRight = selectedCommits[1] + 1;
        selectedCommitsStore.set([newLeft, newRight]);
    }

    const resetPicker = () => {
        selectedCommitsStore.set([0, 10]);
    }
</script>

<div class="flex flex-col">
    <p class="text-xl mt-5">Commit Timeline</p>
    <button type="button" on:click={() => defaultModal = true}
            class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">
        Change Range
    </button>
    <Modal title="Change commit timeline" bind:open={defaultModal} size="xl">
        <div class="grid grid-cols-12">
            <div class="col-span-12 flex justify-between mb-2">
                <p class="text-xl">Past</p>
                <p class="text-xl">Present</p>
            </div>
            <div class="col-span-1">
                <!--'<'-->
                <div class="flex flex-col justify-center items-center">
                    <button type="button"
                            on:click={moveCommitsToLeft}
                            class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">
                        &lt;
                    </button>
                </div>
                <Tooltip>Move commits to left</Tooltip>
            </div>
            <div class="col-span-10">
                <div class="relative flex w-full top-2/3">
                    <div class="flex-grow border-t border-gray-400"></div>
                </div>
                <div class="flex flex-row justify-between">
                    <TimelineDrawer/>
                </div>
            </div>
            <div class="col-span-1">
                <!--'>'-->
                <div class="flex flex-col justify-center items-center">
                    <button type="button"
                            on:click={moveCommitsToRight}
                            class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">
                        &gt;
                    </button>
                </div>
                <Tooltip>Move commits to right</Tooltip>
            </div>
        </div>
        <div class="w-full flex flex-row justify-center">
            <Button class="bg-orange-500" on:click={() => resetPicker()}>Reset selection</Button>
        </div>
    </Modal>
</div>