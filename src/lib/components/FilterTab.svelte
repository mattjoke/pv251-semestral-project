<script>

    let filters = [
        {
            name: 'Folders',
            type: 'folder',
            color: 'yellow',
            icon: 'folder',
            checked: true
        },
        {
            name: 'Files',
            type: 'file',
            color: 'blue',
            icon: 'file',
            checked: true
        },
        {
            name: ".md",
            type: 'extension',
            color: 'green',
            icon: 'file',
            checked: true
        },
        {
            name: ".php",
            type: 'extension',
            color: 'red',
            icon: 'file',
            checked: true
        },
        {
            name: ".js",
            type: 'extension',
            color: 'yellow',
            icon: 'file',
            checked: true
        },
    ]

</script>


<div class="flex flex-col mt-3 h-1/2 overflow-scroll">
    <h1 class="text-2xl text-gray-700">
        Filters
    </h1>
    {#each filters as filter}
        <div class="flex flex-row mr-2 justify-between items-center mb-3">
            <input type="checkbox" class="form-checkbox" checked={filter.checked}/>
            <span class="ml-2 text-lg">{filter.name}</span>
            <div class="ml-auto block max-w-sm p-1 border border-gray-200 rounded-lg shadow bg-{filter.color}-300 hover:scale-105 hover:cursor-pointer">
                <p class="invisible">
                    ☐..
                </p>
            </div>

        </div>
    {/each}
</div>
