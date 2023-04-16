<script>
    import {
        Page, Popover,Link, Button, List, ListItem, Dialog,  DialogButton, Panel, Navbar, Block
    } from 'konsta/svelte';
    import { USER, version } from "$lib/store.js";
    import {getAuth, signOut} from "firebase/auth";
    import {goto} from "$app/navigation";
    let popoverOpened = false;
    let popoverTargetEl = null;
    let errorMessage="";
    let alertOpened = false;

    let rightPanelOpened = false;

    function logOut() {
        const auth = getAuth();

        signOut(auth)
            .then(() =>  goto('/'))
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
        onClick={() => (rightPanelOpened = true)}
>
    <img class="w-8 h-8 rounded-full" src="https://avatars.dicebear.com/api/initials/{$USER?.displayName}.svg" alt="user photo">
</Link>

<Panel
        side="right"
        opened={rightPanelOpened}
        onBackdropClick={() => (rightPanelOpened = false)}
        class="rounded"
>
    <Page>
        <Navbar transparent="true">
            <Link slot="right" navbar onClick={() => (rightPanelOpened = false)}>
                <i class="fa-solid fa-xmark mr-1 text-3xl"></i>
            </Link>
        </Navbar>
        <Block class="space-y-4">
            <p>
                {$USER.displayName == null ? 'No Username' : $USER?.displayName }
            </p>
            <p>
                {$USER.email}
            </p>
        </Block>
        <hr/>
        <List>
            <ListItem title="Sign Out" onClick={logOut}>
            <i class="fa-solid fa-arrow-right-from-bracket" slot="media"></i>
            </ListItem
            >
<!--            <ListItem title="Sign Out" link onClick={logOut} />-->
        </List>
        <hr/>
        <div class="p-5">
            <span class="text-sm text-gray-300">Version: {$version}</span>
        </div>


    </Page>
</Panel>


<!--<Popover-->
<!--        opened={popoverOpened}-->
<!--        target={popoverTargetEl}-->
<!--        onBackdropClick={() => (popoverOpened = false)}-->
<!--&gt;-->
<!--    <List nested>-->
<!--        <ListItem title="Profile" link onClick={() => (popoverOpened = false)} />-->
<!--        <ListItem title="Sign Out" link onClick={logOut} />-->
<!--    </List>-->
<!--</Popover>-->

<Dialog opened={alertOpened} onBackdropClick={() => (alertOpened = false)}>
    <svelte:fragment slot="title">Error</svelte:fragment>
    { errorMessage}
    <svelte:fragment slot="buttons">
        <DialogButton onClick={() => (alertOpened = false)}>Dismiss</DialogButton>
    </svelte:fragment>
</Dialog>