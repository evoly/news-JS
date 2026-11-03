import AppLoader from './appLoader';
import { NewsResponse, SourcesResponse  } from '../types';
class AppController extends AppLoader {
    public getSources(callback: (data: SourcesResponse) => void): void {
        super.getResp<SourcesResponse>(
            {
                endpoint: 'sources',
            },
            callback
        );
    }

    public getNews(
        e: MouseEvent,
        callback: (data: NewsResponse) => void
    ): void {
        let target = e.target as HTMLElement | null;
        const newsContainer = e.currentTarget;

        if (!(target instanceof HTMLElement) || !(newsContainer instanceof HTMLElement)) {
            return;
        }

        while (target && target !== newsContainer) {
            if (target.classList.contains('source__item')) {
                const sourceId = target.getAttribute('data-source-id');

                if (
                    sourceId &&
                    newsContainer.getAttribute('data-source') !== sourceId
                ) {
                    newsContainer.setAttribute('data-source', sourceId);

                    super.getResp<NewsResponse>(
                        {
                            endpoint: 'everything',
                            options: {
                                sources: sourceId,
                            },
                        },
                        callback
                    );
                }
                return;
            }

            const parent: HTMLElement | null = target.parentElement;
            if (!parent) return;
            target = parent;
        }
    }
}

export default AppController;
