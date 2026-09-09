import {
  ArrowRight,
  EllipsisVertical,
  FolderMinus,
  FolderPen,
  FolderPlus,
  Handshake,
  PhoneCall,
  Target,
  Users,
  Wallet,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Label, Pie, PieChart } from "recharts"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

type Kpi = {
  title: string
  value: string
  percentage: string
  isPositive: boolean
  icon: LucideIcon
}

const kpis: Kpi[] = [
  {
    title: "Total Revenue",
    value: "$128.4K",
    percentage: "+18%",
    isPositive: true,
    icon: Wallet,
  },
  {
    title: "Active Deals",
    value: "342",
    percentage: "+12%",
    isPositive: true,
    icon: Handshake,
  },
  {
    title: "New Leads",
    value: "1,284",
    percentage: "-5%",
    isPositive: false,
    icon: Users,
  },
  {
    title: "Conversion Rate",
    value: "24.8%",
    percentage: "+4%",
    isPositive: true,
    icon: Target,
  },
]

const pipelineData = [
  { month: "Jan", won: 31, lost: 18, open: 24 },
  { month: "Feb", won: 83, lost: 32, open: 41 },
  { month: "Mar", won: 53, lost: 27, open: 35 },
  { month: "Apr", won: 36, lost: 22, open: 28 },
  { month: "May", won: 64, lost: 29, open: 44 },
  { month: "Jun", won: 47, lost: 25, open: 33 },
  { month: "Jul", won: 95, lost: 38, open: 52 },
  { month: "Aug", won: 69, lost: 30, open: 40 },
]

const pipelineConfig = {
  won: { label: "Won", color: "var(--color-blue-500)" },
  lost: { label: "Lost", color: "var(--color-sky-400)" },
  open: { label: "Open", color: "rgba(56, 189, 248, 0.5)" },
} satisfies ChartConfig

const sourceData = [
  { source: "Website", value: 55, fill: "var(--color-blue-500)" },
  { source: "Referral", value: 25, fill: "var(--color-sky-400)" },
  { source: "Social", value: 20, fill: "rgba(56, 189, 248, 0.5)" },
]

const sourceConfig = {
  value: { label: "Leads" },
  Website: { label: "Website", color: "var(--color-blue-500)" },
  Referral: { label: "Referral", color: "var(--color-sky-400)" },
  Social: { label: "Social", color: "var(--color-blue-500)" },
} satisfies ChartConfig

const sources = [
  {
    name: "Website",
    amount: "$48.2K",
    change: "+4.7%",
    positive: true,
    dot: "bg-blue-500",
  },
  {
    name: "Referral",
    amount: "$21.9K",
    change: "+2.1%",
    positive: true,
    dot: "bg-sky-400",
  },
  {
    name: "Social",
    amount: "$14.6K",
    change: "-1.7%",
    positive: false,
    dot: "bg-sky-400/50",
  },
]

type Deal = {
  company: string
  contact: string
  email: string
  avatar: string
  fallback: string
  value: string
  stage: string
  stageVariant: "default" | "secondary" | "outline"
  progress: number
  progressColor: string
}

const deals: Deal[] = [
  {
    company: "Acme Corp",
    contact: "Olivia Rhye",
    email: "olivia@acme.com",
    avatar: "https://images.shadcnspace.com/assets/profiles/user-11.jpg",
    fallback: "OR",
    value: "$42,000",
    stage: "Negotiation",
    stageVariant: "default",
    progress: 75,
    progressColor: "**:data-[slot=progress-indicator]:bg-blue-500",
  },
  {
    company: "Globex Inc",
    contact: "Barbara Steele",
    email: "steele@globex.com",
    avatar: "https://images.shadcnspace.com/assets/profiles/user-8.jpg",
    fallback: "BS",
    value: "$28,500",
    stage: "Proposal",
    stageVariant: "secondary",
    progress: 55,
    progressColor: "**:data-[slot=progress-indicator]:bg-orange-400",
  },
  {
    company: "Initech",
    contact: "Leonard Gordon",
    email: "leonard@initech.com",
    avatar: "https://images.shadcnspace.com/assets/profiles/user-3.jpg",
    fallback: "LG",
    value: "$63,000",
    stage: "Discovery",
    stageVariant: "outline",
    progress: 30,
    progressColor: "**:data-[slot=progress-indicator]:bg-teal-400",
  },
  {
    company: "Umbrella Co",
    contact: "Evelyn Pope",
    email: "evelyn@umbrella.com",
    avatar: "https://images.shadcnspace.com/assets/profiles/user-4.jpg",
    fallback: "EP",
    value: "$18,900",
    stage: "Won",
    stageVariant: "secondary",
    progress: 100,
    progressColor: "**:data-[slot=progress-indicator]:bg-teal-400",
  },
  {
    company: "Hooli",
    contact: "Tommy Garza",
    email: "tommy@hooli.com",
    avatar: "https://images.shadcnspace.com/assets/profiles/user-5.jpg",
    fallback: "TG",
    value: "$35,200",
    stage: "Negotiation",
    stageVariant: "default",
    progress: 68,
    progressColor: "**:data-[slot=progress-indicator]:bg-blue-500",
  },
]

type Activity = {
  name: string
  detail: string
  time: string
  avatar: string
  fallback: string
}

const activities: Activity[] = [
  {
    name: "Phone call with Acme",
    detail: "Discussed renewal terms",
    time: "10:30 AM",
    avatar: "https://images.shadcnspace.com/assets/profiles/user-11.jpg",
    fallback: "OR",
  },
  {
    name: "Demo for Globex",
    detail: "Product walkthrough",
    time: "1:00 PM",
    avatar: "https://images.shadcnspace.com/assets/profiles/user-8.jpg",
    fallback: "BS",
  },
  {
    name: "Follow-up with Initech",
    detail: "Sent revised proposal",
    time: "3:15 PM",
    avatar: "https://images.shadcnspace.com/assets/profiles/user-3.jpg",
    fallback: "LG",
  },
  {
    name: "Contract review",
    detail: "Umbrella Co legal sync",
    time: "4:45 PM",
    avatar: "https://images.shadcnspace.com/assets/profiles/user-4.jpg",
    fallback: "EP",
  },
]

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

export default function CRMDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* KPI row */}
      <div className="grid grid-cols-12 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="col-span-12 sm:col-span-6 xl:col-span-3"
          >
            <Card className="rounded-2xl py-6 ring-0">
              <CardContent className="flex items-start justify-between px-6">
                <div className="flex flex-col justify-between gap-5">
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-medium text-card-foreground">
                      {kpi.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-medium text-card-foreground">
                        {kpi.value}
                      </p>
                      <Badge
                        className={cn(
                          "font-normal text-muted-foreground",
                          kpi.isPositive ? "bg-teal-400/10" : "bg-red-500/10"
                        )}
                      >
                        {kpi.percentage}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="h-9 w-fit cursor-pointer rounded-xl shadow-xs"
                  >
                    <span>See Report</span>
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                </div>
                <div className="rounded-full p-3 outline">
                  <kpi.icon />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Pipeline + sources */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8">
          <Card className="w-full gap-6 py-6">
            <CardHeader className="flex flex-col items-start gap-3 px-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg font-medium">
                  Sales Pipeline
                </CardTitle>
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-medium text-card-foreground">
                    $486.2K
                  </h3>
                  <Badge className="bg-teal-400/10 text-muted-foreground shadow-none">
                    +18%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {[
                  { title: "Won", color: "bg-blue-500" },
                  { title: "Lost", color: "bg-sky-400" },
                  { title: "Open", color: "bg-sky-400/50" },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-2">
                    <span className={cn("size-2.5 rounded-full", item.color)} />
                    <p className="text-sm text-muted-foreground">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <ChartContainer config={pipelineConfig} className="h-75 w-full">
                <BarChart
                  accessibilityLayer
                  data={pipelineData}
                  layout="vertical"
                >
                  <CartesianGrid
                    horizontal={false}
                    strokeDasharray="3 3"
                    stroke="rgba(144, 164, 174, 0.3)"
                  />
                  <XAxis
                    type="number"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    fontSize={12}
                  />
                  <YAxis
                    type="category"
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={12}
                    width={40}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar
                    dataKey="won"
                    stackId="a"
                    fill="var(--color-won)"
                    radius={[4, 0, 0, 4]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="lost"
                    stackId="a"
                    fill="var(--color-lost)"
                    barSize={20}
                  />
                  <Bar
                    dataKey="open"
                    stackId="a"
                    fill="var(--color-open)"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <Card className="h-full w-full gap-6 py-6">
            <CardHeader className="px-6">
              <CardTitle className="text-lg font-medium">
                Lead Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-2 px-6">
              <ChartContainer
                config={sourceConfig}
                className="aspect-square max-h-62.5"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={sourceData}
                    dataKey="value"
                    nameKey="source"
                    innerRadius={65}
                    strokeWidth={50}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 10}
                                className="fill-muted-foreground text-sm"
                              >
                                Total
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 15}
                                className="fill-foreground text-xl font-medium"
                              >
                                3,248
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex flex-col gap-3">
                {sources.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(item.dot, "h-4 w-1 rounded-full")} />
                      <h6 className="text-sm leading-tight font-medium">
                        {item.name}
                      </h6>
                    </div>
                    <div className="flex items-center gap-1">
                      <h6 className="text-sm font-medium">{item.amount}</h6>
                      <Badge
                        className={cn(
                          item.positive ? "bg-teal-400/10" : "bg-red-500/10",
                          "text-muted-foreground shadow-none"
                        )}
                      >
                        {item.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Deals + activities */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8">
          <Card className="h-full w-full gap-6 pt-6 pb-0">
            <CardHeader className="items-center justify-between px-6 sm:flex">
              <div>
                <CardTitle className="leading-normal">Recent Deals</CardTitle>
                <CardDescription>
                  Track your hottest opportunities
                </CardDescription>
              </div>
              <InputGroup className="h-9 w-fit rounded-md">
                <InputGroupInput placeholder="Search" />
                <InputGroupAddon>
                  <PhoneCall />
                </InputGroupAddon>
              </InputGroup>
            </CardHeader>
            <CardContent className="px-0">
              <div className="overflow-x-auto">
                <Table className="min-w-2xl">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent!">
                      <TableHead className="p-3 ps-6">#</TableHead>
                      <TableHead className="p-2">Company</TableHead>
                      <TableHead className="p-2">Value</TableHead>
                      <TableHead className="p-2">Stage</TableHead>
                      <TableHead className="p-2">Progress</TableHead>
                      <TableHead className="flex justify-end p-3 pe-6">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deals.map((deal) => (
                      <TableRow key={deal.company}>
                        <TableCell className="p-3 ps-6 whitespace-nowrap">
                          <Checkbox className="cursor-pointer data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 dark:data-[state=checked]:border-blue-500 dark:data-[state=checked]:bg-blue-500" />
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9">
                              <AvatarImage
                                src={deal.avatar}
                                alt={deal.contact}
                              />
                              <AvatarFallback>{deal.fallback}</AvatarFallback>
                            </Avatar>
                            <div className="max-w-56 truncate">
                              <h6 className="text-sm font-medium">
                                {deal.company}
                              </h6>
                              <p className="text-xs text-muted-foreground">
                                {deal.contact} · {deal.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <p className="text-sm text-foreground">
                            {deal.value}
                          </p>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant={deal.stageVariant}>
                            {deal.stage}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Progress
                            value={deal.progress}
                            className={cn(
                              "h-1.5 w-full [&>div]:h-1.5",
                              deal.progressColor
                            )}
                          />
                        </TableCell>
                        <TableCell className="p-3 pe-6 whitespace-nowrap">
                          <div className="flex items-center justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-muted">
                                <EllipsisVertical />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <FolderPlus />
                                    <span>Add</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <FolderPen />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <FolderMinus />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <Card className="h-full gap-6 py-6">
            <CardHeader className="flex items-center justify-between px-6">
              <CardTitle className="text-lg font-medium text-foreground">
                Upcoming Activities
              </CardTitle>
              <CardAction>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 cursor-pointer rounded-xl shadow-xs"
                >
                  <span>View All</span>
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="px-0">
              <div className="flex flex-col gap-3">
                {activities.map((item, index) => (
                  <div key={item.name}>
                    <div className="flex items-center gap-3 px-6">
                      <Avatar className="size-8">
                        <AvatarImage src={item.avatar} alt={item.name} />
                        <AvatarFallback>{item.fallback}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-foreground">
                            {item.name}
                          </h5>
                          <p className="text-sm font-normal tracking-wide text-muted-foreground">
                            {item.detail}
                          </p>
                        </div>
                        <Badge variant="secondary">{item.time}</Badge>
                      </div>
                    </div>
                    {index < activities.length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
