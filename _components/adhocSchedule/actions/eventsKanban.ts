import storeKanban from '../store/kanban.store'
import { eventBus } from 'src/plugins/utils'

export default function eventsKanban() {
    function cardRefresh(): void {
        try {
            eventBus.on('ramp.workOrders.cardRefresh', async (response) => {
                const foundCard = storeKanban.columns
                    .flatMap(column => column?.cards)
                    .find(card => card.id === response.data?.id);
                if (!foundCard) return;
                if(foundCard.loading) return;
            })
        } catch (error) {
            console.log(error);
        }
    }
    return {
        cardRefresh
    }
}
