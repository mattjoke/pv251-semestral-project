<script>
    import {tweened} from "svelte/motion";
    import {quadInOut} from "svelte/easing";

    export let id = "";
    export let percentage = 0;
    export let leftColor = 'blue';
    export let rightColor = '#F3F4F6';

    export let leftTitle = 'Left Title';
    export let rightTitle = 'Right Title';

    const progress = tweened(0, {
        duration: 500,
        easing: quadInOut,
        delay: 500
    });

    $: progress.set(percentage);
</script>

<div class="group">
    <div class="w-full flex flex-row justify-between group-hover:text-black">
        <div class="mb-1 text-base font-medium">{leftTitle}</div>
        <div class="mb-1 text-base font-medium {rightTitle === 'Right Title' ? 'invisible' : 'visible'}">{rightTitle}</div>
    </div>
    <div class="w-full flex flex-row rounded-full h-2.5 mb-4">
        <div class="h-2.5 rounded-l-lg {rightTitle === 'Right Title' ? 'rounded-r-lg' : '' } hover:scale-105 cursor-pointer transition-transform"
             id={id} on:click style:width="{$progress}%" style:background-color="{leftColor}"
             on:keypress
        ></div>
        <div class="h-2.5 rounded-r-lg hover:scale-105 cursor-pointer transition-transform"
             id="{rightTitle === 'Right Title' ? '' : 'right'}" style:width="{100 - $progress}%"
            style:background-color="{rightColor}"
        ></div>
    </div>
</div>
