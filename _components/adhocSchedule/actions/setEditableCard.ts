import getCurrentColumn from "./getCurrentColumn";

export default function setEditableCard(id: number, value: boolean): void {
    try {
        const col = getCurrentColumn()
        col.cards = col?.cards.map(card => {
            return card.id === id ? {...card, editable: value} : card;
        });        
    } catch (error) {
        console.log(error);
    }
}
