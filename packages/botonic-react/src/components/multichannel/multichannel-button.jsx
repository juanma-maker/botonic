import React, { useContext } from 'react'
import { RequestContext } from '../../contexts'
import { Button } from '../button'
import { MultichannelContext } from './multichannel-context'
import { isWhatsapp } from './multichannel-utils'

export const MultichannelButton = props => {
  const requestContext = useContext(RequestContext)
  const multichannelContext = useContext(MultichannelContext)

  const hasUrl = () => Boolean(props.url)

  const hasPath = () => Boolean(props.path)

  const hasPayload = () => Boolean(props.payload)

  const hasPostback = () => hasPath() || hasPayload()

  const hasWebview = () => Boolean(props.webview)

  const getUrl = () => props.url
  const getWebview = () => props.webview

  const formatIndex = index => {
    const boldIndex =
      multichannelContext.boldIndex == null
        ? false
        : multichannelContext.boldIndex
    return boldIndex ? `*${index}*` : index
  }

  const getText = () => {
    let text = props.children
    const newLine = props.newline ? '\n' : ''
    const index = multichannelContext.currentIndex
      ? `${formatIndex(multichannelContext.currentIndex + '.')} `
      : ''
    if (hasPostback()) {
      text = newLine + `${index}${text}`
    } else if (hasUrl()) {
      text = newLine + `- ${text}`
    }
    return text
  }

  if (isWhatsapp(requestContext)) {
    if (hasUrl()) {
      return `${getText()}: ${getUrl()}`
    } else if (hasPath() || hasPayload()) {
      const text = getText()
      multichannelContext.currentIndex += 1
      return `${text}`
    } else if (hasWebview()) return <Button {...props}>{getText()}</Button>
    else return <Button {...props}>{props.children}</Button>
  }
  return <Button {...props}>{props.children}</Button>
}
