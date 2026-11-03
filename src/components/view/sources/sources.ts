import './sources.css';
import type { Source } from '../../types';
import Pagination from '../pagination/pagination';
class Sources {
    private sources: Source[] = [];
    private pagination: Pagination | null = null;

    public draw(data: Source[]): void {
        const sourcesContainer = document.querySelector<HTMLElement>('.sources');
        if (!sourcesContainer) return;

        this.sources = data;

        if (!this.pagination) {
            this.pagination = new Pagination(sourcesContainer, () => this.renderPage());
        }

        this.pagination.setTotalItems(data.length);
        this.renderPage();
    }

    private renderPage(): void {
        const sourceItemTemp = document.querySelector<HTMLTemplateElement>('#sourceItemTemp');
        const sourcesContainer = document.querySelector<HTMLElement>('.sources');

        if (!sourceItemTemp || !sourcesContainer || !this.pagination) return;

        const fragment = document.createDocumentFragment();
        const visibleSources = this.pagination.getPageItems(this.sources);

        visibleSources.forEach((item) => {
            const sourceClone = sourceItemTemp.content.cloneNode(true) as DocumentFragment;

            const sourceName = sourceClone.querySelector<HTMLElement>('.source__item-name');
            const sourceItem = sourceClone.querySelector<HTMLElement>('.source__item');

            if (!sourceName || !sourceItem) return;

            sourceName.textContent = item.name;
            sourceItem.setAttribute('data-source-id', item.id);

            fragment.append(sourceClone);
        });

        sourcesContainer.replaceChildren(fragment);
    }
}

export default Sources;
