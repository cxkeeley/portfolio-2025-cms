import { Tooltip } from 'bootstrap'

import { DataUtil } from '../_utils'

type TooltipQueries = {
  componentName: string
  instanceQuery: string
}

const defaultToolipQueries: TooltipQueries = {
  componentName: 'tooltip',
  instanceQuery: '[data-bs-toggle="tooltip"]',
}

class TooltipComponent {
  element: HTMLElement

  queries: TooltipQueries

  constructor(_element: HTMLElement, _queries: TooltipQueries) {
    this.element = _element
    this.queries = _queries

    new Tooltip(this.element)

    DataUtil.set(this.element, this.queries.componentName, this)
  }

  public static getInstance = (
    element: HTMLElement,
    componentName: string = defaultToolipQueries.componentName
  ): TooltipComponent | undefined => {
    const tooltip = DataUtil.get(element, componentName)
    if (tooltip) {
      return tooltip as TooltipComponent
    }
  }

  public static createInstances = (
    selector: string = defaultToolipQueries.instanceQuery,
    queries: TooltipQueries = defaultToolipQueries
  ) => {
    const elements = document.body.querySelectorAll(selector)
    elements.forEach((element) => {
      const item = element as HTMLElement
      const tooltip = TooltipComponent.getInstance(item)
      if (!tooltip) {
        new TooltipComponent(item, queries)
      }
    })
  }

  public static bootstrap = (
    selector: string = defaultToolipQueries.instanceQuery,
    queries: TooltipQueries = defaultToolipQueries
  ) => {
    TooltipComponent.createInstances(selector, queries)
  }

  public static reinitialize = (
    selector: string = defaultToolipQueries.instanceQuery,
    queries: TooltipQueries = defaultToolipQueries
  ) => {
    TooltipComponent.createInstances(selector, queries)
  }
}

export { TooltipComponent }
