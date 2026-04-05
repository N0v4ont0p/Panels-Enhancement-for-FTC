<script lang="ts">
  import Panels from "$lib/Panels.svelte"
  import { Button, Overlay, TextInput } from "ftc-panels"
  import { global } from "$lib"
  import { goto } from "$app/navigation"
  import Navlets from "./navlets/Navlets.svelte"

  import Options from "./icons/Options.svelte"

  import { getContext } from "svelte"
  import type { Manager } from "./grid/widgets.svelte"
  import TemplatesChoose from "./grid/TemplatesChoose.svelte"
  import Delete from "./icons/Delete.svelte"
  import Add from "./icons/Add.svelte"
  import Copy from "./icons/Copy.svelte"
  import Plugins from "./icons/Plugins.svelte"
  import Docs from "./icons/Docs.svelte"
  import Presets from "./icons/Presets.svelte"
  import Bell from "./icons/Bell.svelte"
  import AllNotifications from "./AllNotifications.svelte"
  const manager = getContext("manager") as Manager

  let jsonPreset = $state("")

  import { getFirstPlugin } from "ftc-panels-docs"

  const first = getFirstPlugin(global.plugins.map((it) => it.details))

  const url = first ? `/docs/${first}` : "/docs"
</script>

<nav class="topbar">
  <a href="/" class="brand" aria-label="Panels home">
    <Panels />
  </a>

  <p class="connection">
    <span class="status-dot"></span>
    {global.isPrepared ? "Connected" : "Waiting"}
  </p>

  {#if global.isPrepared}
    <Navlets {manager} />
  {:else}
    <section class="spacer"></section>
  {/if}

  <Overlay
    triggerStyle={"display: flex;justify-content: center;align-items: center;"}
  >
    {#snippet trigger({ isOpen })}
      <button class="icon-btn" aria-label="Notifications">
        <Bell />
      </button>
    {/snippet}
    {#snippet overlay()}
      <div class="bell-menu">
        <h1>Notifications</h1>

        {#each global.notifications}
          <AllNotifications />
        {:else}
          <p>No notifications</p>
        {/each}
      </div>
    {/snippet}
  </Overlay>

  <a href={url} class="icon-link" aria-label="Docs">
    <Docs />
  </a>

  <Overlay
    triggerStyle={"display: flex;justify-content: center;align-items: center;"}
  >
    {#snippet trigger({ isOpen })}
      <button class="icon-btn" aria-label="Presets">
        <Presets />
      </button>
    {/snippet}
    {#snippet overlay({ close }: { close: () => void })}
      <div class="presets-overlay">
        <h1>Presets</h1>
        {#each manager.presets.data as preset, index}
          <div class="preset">
            <Button
              selected={manager.presets.selected === index}
              onclick={() => {
                manager.change(index)
              }}
            >
              {preset.name}
            </Button>
            <Overlay>
              {#snippet trigger()}
                <Options />
              {/snippet}
              {#snippet overlay({ close }: { close: () => void })}
                <div class="menu">
                  <TextInput
                    bind:value={manager.presets.data[index].name}
                    oninput={() => {
                      manager.save()
                    }}
                  />
                  <Button
                    transparent={true}
                    disabled={manager.presets.data.length === 1}
                    onclick={() => {
                      manager.deletePreset(index)
                      close()
                    }}
                  >
                    <Delete />
                  </Button>
                  <Button
                    transparent={true}
                    onclick={() => {
                      manager.save()
                      const temp = manager.unprocessTemplate(
                        manager.presets.data[index]
                      )
                      close()
                      global.notificationsManager.addAction(
                        JSON.stringify(temp),
                        [
                          {
                            text: "Copy",
                            task: () => {
                              navigator.clipboard
                                .writeText(JSON.stringify(temp))
                                .then(() => {
                                  global.notificationsManager.add(
                                    "Text copied to clipboard"
                                  )
                                })
                                .catch((err) => {
                                  global.notificationsManager.add(
                                    "Failed to copy"
                                  )
                                })
                            },
                          },
                          {
                            text: "Close",
                            task: () => {},
                          },
                        ]
                      )
                    }}
                  >
                    <Copy />
                  </Button>
                </div>
              {/snippet}
            </Overlay>
          </div>
        {/each}
        <TemplatesChoose
          set={(t) => {
            manager.addTemplate(t)
            close()
          }}
        />
        <Overlay
          onStateChange={(isOpen) => {
            if (isOpen) {
              jsonPreset = ""
            }
          }}
        >
          {#snippet trigger()}
            <Button style="width: 100%;">Import</Button>
          {/snippet}
          {#snippet overlay({ close }: { close: () => void })}
            <div class="new-menu">
              <TextInput bind:value={jsonPreset} placeholder={"JSON Preset"} />
              <Button
                style="width: 100%;"
                onclick={() => {
                  manager.addTemplate(JSON.parse(jsonPreset))
                  close()
                }}>Create</Button
              >
            </div>
          {/snippet}
        </Overlay>
        <Button
          onclick={() => {
            manager.newPreset()
            close()
          }}
        >
          <Add />
        </Button>
      </div>
    {/snippet}
  </Overlay>

  <Overlay
    triggerStyle={"display: flex;justify-content: center;align-items: center;"}
  >
    {#snippet trigger({ isOpen })}
      <button class="icon-btn" aria-label="Plugins">
        <Plugins />
      </button>
    {/snippet}
    {#snippet overlay({ close }: { close: () => void })}
      <div class="plugins-overlay">
        <h1>Plugins</h1>

        <div class="grid">
          {#each global.plugins as plugin}
            <button
              class="plugin"
              onclick={() => {
                goto(`/plugins/${plugin.details.id}`)
                close()
              }}
            >
              {plugin.details.letterName}
            </button>
          {/each}
          {#each global.skippedPlugins as details}
            <button class="plugin" disabled onclick={close}>
              {details.letterName}
            </button>
          {/each}
        </div>

        <Button
          style="margin-top: 0.5rem"
          onclick={() => {
            goto("/plugins")
            close()
          }}>Details</Button
        >
      </div>
    {/snippet}
  </Overlay>
</nav>

<style>
  .topbar {
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--bgMedium) 88%, #0d1622 12%),
      color-mix(in srgb, var(--bgMedium) 94%, #0d1622 6%)
    );
    padding: 0 var(--space-3);

    display: flex;
    justify-content: space-between;
    align-items: center;

    border-radius: var(--radius-lg);
    margin: 0;

    gap: var(--space-3);
    max-width: 100%;

    overflow-x: auto;
    overflow-y: hidden;
    max-height: 74px;
    min-height: 74px;
    border: 1px solid #505151;
    border: 1px solid color-mix(in srgb, var(--border-subtle) 92%, white 8%);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
  }
  .spacer {
    flex-grow: 1;
  }
  .brand {
    display: flex;
    align-items: center;
  }
  h1 {
    margin: 0;
    margin-bottom: var(--space-2);
    font-size: clamp(1.15rem, 0.45vw + 1rem, 1.5rem);
  }
  .connection {
    margin: 0;
    font-size: 0.8rem;
    display: inline-flex;
    align-items: center;
    gap: 0.42rem;
    white-space: nowrap;
    opacity: 0.95;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--mutedText);
  }
  .status-dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background-color: var(--primary);
    box-shadow: 0 0 0 0.15rem rgba(230, 0, 18, 0.35);
    box-shadow: 0 0 0 0.15rem color-mix(in srgb, var(--primary) 35%, transparent);
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  .icon-link,
  .icon-btn {
    width: 2.05rem;
    height: 2.05rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    border: 1px solid transparent;
    color: inherit;
    background-color: transparent;
    transition: background-color 120ms ease, border-color 120ms ease, transform 120ms ease;
  }
  .icon-btn {
    cursor: pointer;
  }
  .icon-link:hover,
  .icon-btn:hover {
    background-color: color-mix(in srgb, var(--bgLight) 38%, transparent);
    border-color: color-mix(in srgb, var(--primary) 44%, transparent);
  }
  .icon-link:active,
  .icon-btn:active {
    transform: translateY(1px);
  }
  .plugins-overlay {
    min-width: min(300px, calc(100vw - 2rem));
    min-height: 130px;
    max-height: min(70vh, 480px);

    overflow-y: auto;

    padding: var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 90%, white 10%);
    background: color-mix(in srgb, var(--bgRaised) 94%, transparent);
    box-shadow: var(--shadow-md);
  }
  .presets-overlay {
    min-width: min(360px, calc(100vw - 2rem));
    min-height: 160px;
    max-height: min(76vh, 560px);

    overflow-y: auto;

    display: flex;
    flex-direction: column;

    padding: var(--space-3);
    gap: var(--space-2);
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 90%, white 10%);
    background: color-mix(in srgb, var(--bgRaised) 94%, transparent);
    box-shadow: var(--shadow-md);
  }
  .preset {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }
  .menu {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2);
    max-height: 600px;
    border-radius: var(--radius-sm);
  }

  .new-menu {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
    padding: var(--space-2);
    max-height: 600px;
    min-width: min(400px, calc(100vw - 3rem));
    border-radius: var(--radius-sm);
  }

  .bell-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3);
    max-height: 800px;
    min-width: min(340px, calc(100vw - 2rem));
    max-width: 460px;
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 90%, white 10%);
    background: color-mix(in srgb, var(--bgRaised) 94%, transparent);
    box-shadow: var(--shadow-md);
  }
  .grid {
    margin-top: var(--space-2);

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(42px, auto));
    gap: var(--space-2);
  }

  button.plugin {
    background-color: color-mix(in srgb, var(--bgDark) 50%, transparent);
    color: inherit;
    margin: 0;
    border: 1px solid color-mix(in srgb, var(--border-subtle) 86%, white 14%);
    padding: var(--space-1);
    border-radius: 69vw;
    width: 42px;
    height: 42px;
    display: grid;
    place-content: center;
    cursor: pointer;
  }
  button.plugin:hover:not(:disabled) {
    border-color: color-mix(in srgb, var(--primary) 35%, var(--bgLight));
    background-color: color-mix(in srgb, var(--bgLight) 60%, #111f2f 40%);
  }

  @media (max-width: 1280px) {
    .topbar {
      min-height: 68px;
      max-height: 68px;
      padding: 0 var(--space-2);
      gap: var(--space-2);
    }
  }
</style>
