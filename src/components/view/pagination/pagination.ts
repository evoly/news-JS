import './pagination.css';

const ROWS_PER_PAGE = 5;

export default class Pagination {
    private columnCount = 0;
    private currentPage = 1;
    private totalItems = 0;

    private container: HTMLElement;
    private prevButton: HTMLButtonElement;
    private nextButton: HTMLButtonElement;
    private pageIndicator: HTMLElement;
    private onPageChange: () => void;

    constructor(container: HTMLElement, onPageChange: () => void) {
        this.container = container;
        this.onPageChange = onPageChange;

        this.prevButton = document.querySelector<HTMLButtonElement>('.pagination-prev')!;
        this.nextButton = document.querySelector<HTMLButtonElement>('.pagination-next')!;
        this.pageIndicator = document.querySelector<HTMLElement>('.pagination-current')!;

        this.prevButton.addEventListener('click', () => this.changePage(-1));
        this.nextButton.addEventListener('click', () => this.changePage(1));

        this.columnCount = this.getColumnCount();

        const observer = new ResizeObserver(() => {
            const newColumnCount = this.getColumnCount();

            if (newColumnCount === this.columnCount) return;

            this.columnCount = newColumnCount;
            this.currentPage = Math.min(this.currentPage, this.getTotalPages());

            this.update();

            requestAnimationFrame(() => {
                this.onPageChange();
            });
        });

        observer.observe(this.container);
    }


    private getColumnCount(): number {
        const styles = getComputedStyle(this.container);
        return styles.gridTemplateColumns.split(' ').length;
    }

    private getItemsPerPage(): number {
        return this.getColumnCount() * ROWS_PER_PAGE;
    }

    private getTotalPages(): number {
        return Math.max(1, Math.ceil(this.totalItems / this.getItemsPerPage()));
    }

    private changePage(direction: number): void {
        const nextPage = this.currentPage + direction;

        if (nextPage < 1 || nextPage > this.getTotalPages()) return;

        this.currentPage = nextPage;
        this.update();
        this.onPageChange();
    }

    public setTotalItems(total: number): void {
        this.totalItems = total;
        this.currentPage = 1;
        this.update();
    }

    public getPageItems<T>(items: T[]): T[] {
        const itemsPerPage = this.getItemsPerPage();
        const start = (this.currentPage - 1) * itemsPerPage;

        return items.slice(start, start + itemsPerPage);
    }

    private update(): void {
        this.pageIndicator.textContent = String(this.currentPage);

        this.prevButton.disabled = this.currentPage === 1;
        this.nextButton.disabled = this.currentPage >= this.getTotalPages();
    }
}
