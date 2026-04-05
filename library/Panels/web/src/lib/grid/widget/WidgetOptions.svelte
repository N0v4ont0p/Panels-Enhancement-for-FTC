<script lang="ts">
  import Options from "$lib/icons/Options.svelte"
  import { Button, Overlay } from "ftc-panels"
  import { type ExtendedWidgetGroup } from "../widgets.svelte"
  import { getContext, tick } from "svelte"
  import type { Manager } from "../widgets.svelte"
  const manager = getContext("manager") as Manager

  let { widget = $bindable() }: { widget: ExtendedWidgetGroup } = $props()
</script>

<Overlay>
  {#snippet trigger()}
    <button class="icon"><Options /></button>
  {/snippet}
  {#snippet overlay({ close }: { close: () => void })}
    <div class="menu">
      <Button
        onclick={() => {
          manager.removeWidget(widget.id)
          close()
        }}>Remove Group</Button
      >
      <Button
        onclick={() => {
          if (widget.selected >= 0 && widget.widgets.length > 0) {
            widget.widgets.splice(widget.selected, 1)
            if (widget.selected < 0) {
              widget.selected = 0
            }
            if (widget.selected > widget.widgets.length - 1) {
              widget.selected = widget.widgets.length - 1
            }
          }
          close()
        }}
        disabled={widget.selected < 0 || widget.widgets.length <= 0}
        >Remove Widget</Button
      >
      <Button
        onclick={() => {
          if (widget.selected >= 0 && widget.widgets.length > 0) {
            widget.widgets[widget.selected] = {
              isMoving: false,
              pluginID: "",
              widgetID: "",
            }
          }
          close()
        }}
        disabled={widget.selected < 0 || widget.widgets.length <= 0}
        >Clear Widget</Button
      >
      <Button
        onclick={async () => {
          widget.widgets.push({
            isMoving: false,
            pluginID: "",
            widgetID: "",
          })

          widget.selected = widget.widgets.length - 1

          await tick()

          const tab = document.querySelector(
            `[data-widget="${widget.id}"][data-index="${widget.selected}"]`
          ) as HTMLElement

          tab.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          })

          close()
        }}>Insert Widget</Button
      >
    </div>
  {/snippet}
</Overlay>

<style>
  .menu {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
    min-width: 220px;
  }
  .icon {
    all: unset;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
  }
  .icon:hover {
    background-color: color-mix(in srgb, var(--bgLight) 75%, white 25%);
  }
</style>
