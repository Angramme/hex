<script>
    import "$lib/global.sass"
    import Grid from '$lib/grid.svelte';
    import { GState } from '$lib/gstate';
    import { onMount } from "svelte";

    let state = new GState(11);    

    let ongridclick = ()=>{};
    let active = false;
    let party_url = "";

    onMount(async ()=>{
        const Peer = (await import('peerjs')).default;
        const peer = new Peer();

        const shout = (e)=>{
            const s = JSON.stringify(e);
            for(let connid in peer.connections){
                peer.connections[connid]
                .forEach(conn=>{
                    if(conn)conn.send(s)
                });
            }
        };
        const playersongridclick = state.players.map(p=>p.on("gridclick"));
        const handlegridclick = (args)=>{
            playersongridclick.forEach(x=>x(args));
        }
        ongridclick = (args)=>{
            args.detail.peer_id = peer.id;
            shout({
                event: 'gridclick',
                args: {
                    detail: args.detail
                },
            });
            handlegridclick(args);
        }

        const sparams = new URLSearchParams(window.location.search);
        const sess_id = sparams.get("session");

        const handlepeerdata = (datas)=>{
            const data = JSON.parse(datas);
            if(data.event == 'gridclick'){
                handlegridclick(data.args);
            }else if(data.event == 'statesync'){
                console.log('syncing state...');
                state.sync_json(data.data);
                state = state;
            }
        };

        if(!sess_id){
            peer.on('open', ()=>{
                state.players.forEach(x=>x.id = peer.id);
                party_url = window.location.origin+window.location.pathname + '?session='+peer.id;
            });
            peer.on('connection', (conn)=>{
                state.players[1].id = conn.peer;
                conn.on('data', handlepeerdata);
                conn.on('open', ()=>{
                    active = true;
                    console.log('sending sync data...');
                    conn.send(JSON.stringify({
                        event: 'statesync',
                        data: state.to_json(),
                    }));
                });
                conn.on('close', ()=>active = false);
            });
        }else{
            peer.on('open', ()=>{
                state.players.forEach(x=>x.id = peer.id);
                state.players[0].id = sess_id;
                party_url = window.location.origin+window.location.pathname + '?session='+peer.id;
                
                console.log('connecting to peer '+sess_id);
                let conn = peer.connect(sess_id);
                conn.on('data', handlepeerdata);
                conn.on('open', ()=>active = true);
                conn.on('close', ()=>active = false);
            });
            peer.on('connection', (conn)=>{
                state.players[0].id = conn.peer;
                conn.on('data', handlepeerdata);
                conn.on('open', ()=>{
                    active = true;
                    console.log('sending sync data...');
                    conn.send(JSON.stringify({
                        event: 'statesync',
                        data: state.to_json(),
                    }));
                });
                conn.on('close', ()=>active = false);
            });
        }

        const loop = async ()=>{
            const current = state.current_player;
            if(state.winner()) return;

            let move = null;
            do{
                move = await current.get_move();
            }while(!state.move(move, state.current_player_i+1));
            state = state;

            state.next_player();
            requestAnimationFrame(loop);
        }
        loop();
    });
</script>

<svelte:head>
    <title>hex</title>
</svelte:head>

{#if active}
    <Grid
        grid={state.grid}
        on:click={ongridclick}/>
{:else}
    <div>waiting for the other player...</div>
    {#if party_url}
        <div>invitation link: {party_url}</div>
    {/if}
{/if}