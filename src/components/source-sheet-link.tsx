import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildSourceUrl } from "@/lib/google-sheets/client"

type SourceSheetLinkProps = {
  spreadsheetId: string
}

/** Tombol buka file spreadsheet sumber di tab baru. */
export function SourceSheetLink({ spreadsheetId }: SourceSheetLinkProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      render={
        <a
          href={buildSourceUrl(spreadsheetId)}
          target="_blank"
          rel="noreferrer"
        />
      }
    >
      <ExternalLink data-icon="inline-start" aria-hidden />
      Data Source
    </Button>
  )
}
