export default function (variables: Record<string, string>) {
  for (const cssVar in variables) {
    document.documentElement.style.setProperty(
      `--${cssVar}`,
      variables[cssVar] ?? null,
    )
  }
}
