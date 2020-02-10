import React from 'react'
import { RequestContext } from '../../contexts'
import { Text } from '../text'
import { Providers } from '@botonic/core'
import { buttonHasUrl, getButtons } from './multichannel-utils'

export class MultichannelText extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)
    this.elements = []
    this.index = props.index !== undefined ? props.index + 1 : undefined
  }
  render() {
    if (
      this.context.session &&
      this.context.session.user &&
      this.context.session.user.provider == Providers.Messaging.WHATSAPPNEW
    ) {
      let text = !Array.isArray(this.props.children)
        ? [this.props.children]
        : this.props.children.filter(e => !e.props)

      let buttonsWithoutUrl = getButtons(this.props.children, but => !buttonHasUrl(but))
      let buttonsWithUrl = getButtons(this.props.children, buttonHasUrl)


      this.elements = [].concat(
        [...text],
        [...buttonsWithoutUrl],
        [...buttonsWithUrl]
      )
      let index = 0
      return (
        <Text {...this.props}>
          {this.elements.map((element, i) => {
            if (
              (element.props && element.props.payload != undefined) ||
              (element.props && element.props.path != undefined)
            ) {
              index += 1
            }
            let option = ' - '
            if (element.type && element.type.name == 'MultichannelButton') {
              if (element.props.payload || element.props.path) {
                option = this.index ? ` ${this.index}. ` : ` ${index}. `
              }
              let props = {}
              props.url = element.props.url
              props.children = `\n${option}${element.props.children}`
              props.key = i
              let newElement = React.cloneElement(element, { ...props })
              return newElement
            } else if (
              element.type &&
              element.type.name == 'MultichannelReply'
            ) {
              if (element.props.payload || element.props.path) {
                option = this.index ? ` ${this.index}. ` : ` ${index}. `
              }
              let props = {}
              props.children = `\n${option}${element.props.children}`
              props.key = i
              let newElement = React.cloneElement(element, { ...props })
              return newElement
            } else {
              return `${element}`
            }
          })}
        </Text>
      )
    } else {
      return <Text {...this.props}>{this.props.children}</Text>
    }
  }
}
