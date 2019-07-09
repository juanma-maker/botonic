import { Entry, EntryCollection } from 'contentful';
import { Context } from '../cms';
import * as cms from '../cms';
import { ModelType, SearchResult } from '../cms';
import { ContentWithKeywordsFields, DeliveryApi } from './delivery-api';
import { QueueFields } from './queue';

export class KeywordsDelivery {
  constructor(private readonly delivery: DeliveryApi) {}

  async contentsWithKeywords(context: Context): Promise<SearchResult[]> {
    let fromKeywords = this.entriesWithKeywords(context);
    let fromSearchable = this.entriesWithSearchableByKeywords(context);
    return (await fromKeywords).concat(await fromSearchable);
  }

  private static resultFromEntry(
    entry: Entry<{ name: string; shortText: string }>,
    keywords: string[],
    priority?: number
  ): SearchResult {
    let contentModel = DeliveryApi.getContentModel(entry);
    if (!entry.fields.shortText) {
      console.error(`No shortText found ${contentModel} ${name}`);
      entry.fields.shortText = name;
    }

    let callback = DeliveryApi.callbackFromEntry(entry);
    return new SearchResult(
      callback,
      entry.fields.name,
      entry.fields.shortText,
      keywords,
      priority
    );
  }

  private async entriesWithSearchableByKeywords(
    context: Context
  ): Promise<SearchResult[]> {
    let queues = await this.delivery.getEntries<QueueFields>(context, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      content_type: ModelType.QUEUE,
      'fields.searchableBy[exists]': true,
      include: 1
    });
    let results = queues.items.map(queue =>
      KeywordsDelivery.resultsFromQueue(queue)
    );
    return Array.prototype.concat(...results);
  }

  private static resultsFromQueue(queue: Entry<QueueFields>): SearchResult[] {
    return queue.fields.searchableBy!.map(searchable =>
      this.resultFromEntry(
        queue,
        searchable.fields.keywords,
        searchable.fields.priority
      )
    );
  }

  private entriesWithKeywords(context: Context): Promise<SearchResult[]> {
    const getWithKeywords = (contentType: cms.ModelType) =>
      this.delivery.getEntries<ContentWithKeywordsFields>(context, {
        // eslint-disable-next-line @typescript-eslint/camelcase
        content_type: contentType,
        'fields.keywords[exists]': true,
        include: 0
      });
    let promises = [];
    for (let contentType of [
      cms.ModelType.CAROUSEL,
      cms.ModelType.TEXT,
      cms.ModelType.URL
    ]) {
      promises.push(getWithKeywords(contentType));
    }
    return Promise.all(promises).then(entryCollections =>
      KeywordsDelivery.flatMapEntryCollection(entryCollections).map(entry =>
        KeywordsDelivery.resultFromEntry(entry, entry.fields.keywords)
      )
    );
  }

  private static flatMapEntryCollection<T>(
    collections: EntryCollection<T>[]
  ): Entry<T>[] {
    let entries = [] as Entry<T>[];
    collections.forEach(collection => entries.push(...collection.items));
    return entries;
  }
}