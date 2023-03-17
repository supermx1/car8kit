<script>
    import {
        Page, Popover,Link, Button, List, ListItem, Dialog,  DialogButton,
    } from 'konsta/svelte';
    import { USER } from "$lib/store.js";
    import {getAuth, signOut} from "firebase/auth";
    import {goto} from "$app/navigation";
    let popoverOpened = false;
    let popoverTargetEl = null;
    let errorMessage="";
    let alertOpened = false;



    function logOut() {
        const auth = getAuth();

        signOut(auth)
            .then(() => {
            goto('/login');
        })
            .catch((error) => {
            console.log(error)
            alertOpened = true;
            errorMessage = error.message;
        });
        $USER = null;
    }

    const openPopover = (targetEl) => {
        popoverTargetEl = targetEl;
        popoverOpened = true;
    };
</script>

<Link
        slot="right"
        class="popover-navbar-link"
        navbar
        onClick={() => openPopover('.popover-navbar-link')}
>
    <img class="w-8 h-8 rounded-full" src="https://avatars.dicebear.com/api/initials/{$USER?.displayName}.svg" alt="user photo">
</Link>

<Popover
        opened={popoverOpened}
        target={popoverTargetEl}
        onBackdropClick={() => (popoverOpened = false)}
>
    <List nested>
        <ListItem title="Profile" link onClick={() => (popoverOpened = false)} />
        <ListItem title="Sign Out" link onClick={logOut} />
    </List>
</Popover>

<Dialog opened={alertOpened} onBackdropClick={() => (alertOpened = false)}>
    <svelte:fragment slot="title">Error</svelte:fragment>
    { errorMessage}
    <svelte:fragment slot="buttons">
        <DialogButton onClick={() => (alertOpened = false)}>Dismiss</DialogButton>
    </svelte:fragment>
</Dialog>