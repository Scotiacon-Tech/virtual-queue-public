import {fetchCreateTicket, fetchUpdateTicket} from "~/composables/api/events";

export const useTicketOps = (eventId: string)  => {
    const busyGettingATicket = ref<boolean>(false);
    const busyHolding = ref<boolean>(false)
    const busyRejoin = ref<boolean>(false)

    async function newTicket() {
        if (eventId) {
            console.log("Getting a new ticket", {eventId});
            try {
                busyGettingATicket.value = true
                await fetchCreateTicket(eventId)
                return true;
            } catch (error) {
                console.error("An error occurred trying to create a new ticket", error);
                return false;
            } finally {
                busyGettingATicket.value = false
            }
        }
    }


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

    return {
        newTicket,
        newTicketBusy: busyGettingATicket,
        holdTicket,
        holdTicketBusy: busyHolding,
        rejoinTicket,
        rejoinTicketBusy: busyRejoin,
    }
}