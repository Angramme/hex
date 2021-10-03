
<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    
    import { creategridstate, getcolor, hexagon, hexsize, tocoords } from "$lib/grid.js";
    
    export let grid = creategridstate(9);
    $: gw = grid[0].length;
    $: gh = grid.length;

    const onclick = (x, y)=>(args)=>dispatch('click', {
        cellX: x,
        cellY: y,
    });
</script>

<div>
    <svg viewBox={`-${hexsize*1.5} -${hexsize*1.2} ${tocoords([gw+0.7, 0], [gw-1, gh-1])[0]} ${tocoords([0, gh+0.2], [gw-1, gh-1])[1]}`}>
        {#each grid as row, y}
            {#each row as cell, x}
                <polygon 
                    on:click={onclick(x, y)}
                    points={hexagon}
                    stroke-width={"0"}
                    fill={getcolor(cell)}
                    transform={(`translate(${tocoords([x, y], [gw-1, gh-1]).join(", ")}) scale(1.05)`)}
                    />
            {/each}
        {/each}
    </svg>
</div>


<style lang="sass">
    div
        position: relative
        height: 100vh
        width: 100vw
    svg
        display: block
        position: absolute
        left: 50%
        top: 50%
        transform: translate(-50%, -50%)
        margin: auto
        width: 100%
        height: 100%

</style>

    