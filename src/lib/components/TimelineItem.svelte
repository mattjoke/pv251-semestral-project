<script>
    import {Popover} from "flowbite-svelte";
    import {fade, slide} from "svelte/transition";

    export let commit;
</script>
<div class="flex flex-col items-center cursor-pointer z-10" in:slide={{ delay: 250, duration: 300, axis: 'x' }}
     out:fade={{delay:250, duration:300}}>
    {commit.oid.substring(0, 10)}
    <div class="rounded-full bg-green-300 w-10 h-10" id="{commit.oid}">
        <div class="invisible">
            W
        </div>
        <Popover triggeredBy="[id^='{commit.oid}']" placement="bottom" title="Author: {commit.commit.author.name}">
            {@html commit.commit.message}
        </Popover>
    </div>
</div>