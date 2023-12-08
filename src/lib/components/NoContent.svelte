<script>
    import RepoInput from "$lib/components/RepoInput.svelte";
</script>

<div class="flex flex-col justify-center items-center h-full p-12 md:p-5">

    <h1 class="mb-4 text-3xl font-extrabold dark:text-gray-900 text-black md:text-5xl lg:text-6xl">
        <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            LogGit
        </span>
        A <span class="underline">git history</span> viewer</h1>
    <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
        Hello and welcome! Get started by entering a git repository URL. The URL has to point to a public git
        repository.
    </p>
    <div class="w-1/2 mt-5">
        <RepoInput/>
    </div>
</div>

