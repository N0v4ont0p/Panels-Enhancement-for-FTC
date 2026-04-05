<script lang="ts">
  import WidgetTopBar from "./WidgetTopBar.svelte"
  import WidgetResize from "./WidgetResize.svelte"
  import WidgetChoose from "./WidgetChoose.svelte"
  import { getContext } from "svelte"
  import type { ExtendedWidgetGroup, Manager } from "../widgets.svelte"
  import WidgetContent from "../WidgetContent.svelte"
  const manager = getContext("manager") as Manager

  let {
    widget = $bindable(),
    isPossible,
  }: { widget: ExtendedWidgetGroup; isPossible: boolean } = $props()
  let isSmall = $derived(widget.w == 1 && widget.h == 1)
</script>

<div
  class="item"
  class:transparent={widget.isMoving && !isPossible}
  style="--x:{widget.x};--y:{widget.y};--w:{widget.w};--h:{widget.h};--xOffset:{widget
    .offset.x}px;--yOffset:{widget.offset.y}px;--xMove:{widget.move
    .x}px;--yMove:{widget.move.y}px;"
>
  <div
    class="content"
    class:invalid={!manager.isValid &&
      !isPossible &&
      manager.isMoving &&
      manager.placeStart == null}
  >
    <WidgetTopBar bind:widget bind:isPossible />

    <section>
      {#if widget.widgets.length > 0}
        {#each widget.widgets, index}
          <div
            class="wrapper"
            style={index == widget.selected
              ? "display:block;"
              : "display:none;"}
          >
            {#if widget.widgets[index].pluginID != "" && widget.widgets[index].widgetID != "" && manager.exists(widget.widgets[index].pluginID, widget.widgets[index].widgetID)}
              <WidgetContent
                pluginID={widget.widgets[index].pluginID}
                widgetID={widget.widgets[index].widgetID}
              />
            {:else}
              <WidgetChoose
                set={(pID, wID) => {
                  widget.widgets[index].pluginID = pID
                  widget.widgets[index].widgetID = wID
                }}
              />
            {/if}
          </div>
        {/each}
      {:else}
        <WidgetChoose
          set={(pID, wID) => {
            widget.widgets.push({
              isMoving: false,
              pluginID: pID,
              widgetID: wID,
            })
          }}
        />
      {/if}
    </section>
    <WidgetResize bind:widget bind:isPossible />
  </div>
</div>

<style>
  .wrapper {
    height: 100%;
  }
  section {
    padding: var(--panel-padding);
    overflow: auto;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
  .item {
    position: absolute;
    top: calc(var(--y) * var(--height) + var(--yMove));
    left: calc(var(--x) * var(--width) + var(--xMove));
    height: calc(var(--h) * var(--height) + var(--yOffset));
    width: calc(var(--w) * var(--width) + var(--xOffset));
    display: flex;
    flex-direction: column;
    padding: var(--spacing);
  }
  .content {
    position: relative;
    flex-grow: 1;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--bgMedium) 94%, #121c2a 6%),
      color-mix(in srgb, var(--bgMedium) 98%, #121c2a 2%)
    );
    overflow: hidden;

    display: flex;
    flex-direction: column;

    border-radius: var(--radius-lg);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 88%, white 12%);
    box-shadow: var(--shadow-md);
  }
  .content.invalid {
    border-color: #e60012;
    box-shadow: 0 0 0 2px rgba(230, 0, 18, 0.3), var(--shadow-md);
  }
  .transparent {
    opacity: 0.55;
  }

  section :global(h1),
  section :global(h2),
  section :global(h3),
  section :global(h4) {
    margin: 0;
    line-height: 1.2;
  }

  section :global(label),
  section :global(th),
  section :global(dt) {
    font-size: 0.88rem;
    opacity: 0.88;
    letter-spacing: 0.015em;
  }

  section :global(td),
  section :global(dd),
  section :global(p) {
    line-height: 1.45;
    color: color-mix(in srgb, var(--text) 94%, white 6%);
  }

  section :global(input),
  section :global(select),
  section :global(textarea),
  section :global(button) {
    min-height: var(--control-height);
  }

  section :global(canvas),
  section :global(svg) {
    max-width: 100%;
  }

  section :global(table) {
    width: 100%;
    border-collapse: collapse;
  }

  section :global(table td),
  section :global(table th) {
    padding: 0.35rem 0.5rem;
    vertical-align: middle;
  }
</style>
