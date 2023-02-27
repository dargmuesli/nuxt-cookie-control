import cssVars from 'css-vars-ponyfill'

export default function (variables: Record<string, string>) {
  cssVars({ variables })
}
