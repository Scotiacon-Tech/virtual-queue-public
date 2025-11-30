import {fetchCreateTicket, fetchUpdateTicket} from "~/composables/api/events";

export const useTicketOps = ()  => {
    const busyHolding = ref<boolean>(false)
    const busyRejoin = ref<boolean>(false)
    const busyCheckingIn = ref<boolean>(false)

    async function holdTicket(id: string) {
        try {
            console.log("Holding ticket", {id})
            busyHolding.value = true;
            await fetchUpdateTicket(id, {state: "OnHold"})
            return true;
        } catch (error) {
            console.error("Error holding ticket", error)
            return false;
        } finally {
            busyHolding.value = false;
        }
    }

    async function rejoinTicket(id: string) {
        try {
            console.log("Rejoining queue", {id})
            busyRejoin.value = true;
            await fetchUpdateTicket(id, {state: "Requested"})
            return true;
        } catch (error) {
            console.error("Error rejoining", error)
            return false;
        } finally {
            busyRejoin.value = false;
        }
    }

    async function checkInTicket(id: string) {
        try {
            console.log("Checking in", {id})
            busyCheckingIn.value = true;
            await fetchUpdateTicket(id, {state: "CheckedIn"})
            return true;
        } catch (error) {
            console.error("Error checking in", error)
            return false;
        } finally {
            busyCheckingIn.value = false;
        }
    }



    return {
        holdTicket,
        holdTicketBusy: busyHolding,
        rejoinTicket,
        rejoinTicketBusy: busyRejoin,
        checkInTicket,
        checkInTicketBusy: busyCheckingIn,
    }
}