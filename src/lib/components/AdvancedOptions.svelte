<script>
    import {Checkbox, Input, Label} from "flowbite-svelte";
    import {advancedOptionsStore} from "$lib/stores/stores.js";

    let expand = false;

    let commits = -1;
    let branch = "main";

    $: {
        advancedOptionsStore.set({commits, branch});
    }
</script>

{#if !expand}
    <Checkbox on:click={() => expand = true}>Advanced options</Checkbox>
{:else}
    <Checkbox checked on:click={()=> expand = false}>Advanced options</Checkbox>
{/if}
<div class="flex flex-row justify-around {expand?'visible': 'invisible'}">
    <div class="flex flex-col">
        <Label for="commit-input" class="m-2">Number of commits (Default: -1 => All)</Label>
        <Input id="commit-input" bind:value={commits}/>
    </div>

    <div class="flex flex-col">
        <Label for="branch-input" class="m-2">Branch name (Default: main)</Label>
        <Input id="branch-input" bind:value={branch}/>
    </div>
</div>
