<script>
    import {Popover} from "flowbite-svelte";

    export let commitMessage = 'Initial commit';
    export let commitAuthor = 'John Doe';
</script>

<a id="commit-message" class="underline cursor-pointer">
    {commitMessage.substring(0, 20) + '...'}
</a>
<Popover class="w-64 text-sm font-light " title="Author: {commitAuthor}" triggeredBy="#commit-message">
    {@html commitMessage}
</Popover>
