import { ClipVector } from "@bentley/geometry-core/lib/numerics/ClipVector";
import { ClipPlane } from "@bentley/geometry-core/lib/numerics/ClipPlanes";
import { Transform, Point3d } from "@bentley/geometry-core/lib/PointVector";
import { BentleyStatus } from "@bentley/bentleyjs-core/lib/Bentley";

import { assert } from "chai";

import { ColorDef } from "../../common/ColorDef";
import { Decorations, DecorationList, GraphicList, ViewFlags, LinePixels, Graphic } from "../../common/Render";

import { BranchState, BranchStack } from "./BranchState";
import { LineCode, EdgeOverrides } from "./EdgeOverrides";
import { LUTDimension, LUTParams, FeatureDimension, FeatureIndexType, FeatureDimensions, FeatureDimensionsIterator } from "./FeatureDimensions";
import { FloatRgb, FloatRgba, FloatPreMulRgba } from "./FloatRGBA";
import { GL } from "./GL";
import { RenderPass, GeometryType, TextureUnit, RenderOrder, isPlanar, isSurface, CompositeFlags, SurfaceFlags, OvrFlags, IsTranslucent } from "./RenderFlags";
import { RenderStateFlags, RenderStateBlend, RenderState } from "./RenderState";
import { Mode, WithClipVolume, TechniqueFlags } from "./TechniqueFlags";
import { BuiltInTechniqueId, TechniqueId } from "./TechniqueId";
import { Handle, BufferHandle } from "./Handle";

// CACHED GEOMETRY
export class MaterialData {
  a: FloatRgb; 
  b: FloatPreMulRgba;
  c: Material;
}
export class NonUniformColor {
  a: LUTParams;
  b: BufferHandle;
  c: ColorTable;
  d: GLESTexture;
}
export class ColorData {
  a: NonUniformColor;
  b: LUTDimension;
  c: FloatPreMulRgba;
}
export class FeatureIndices {
  a: BufferHandle;
  b: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
}
export class FeatureDimensions {
  a: FeatureIndex.Type; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
}
export class LitMeshData {
  a: BufferHandle;
  b: MaterialData;
}
export class TexturedMeshData {
  a: QBufferHandle2d; // ./Handle.ts
  c: GLES.Texture;
}
export class CachedGeometry {
  a: QBufferHandle3d; // ./Handle.ts
  b: QPoint3d; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  c: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  d: ViewportQuad;
  e: BentleyStatus; // was StatusInt;
  f: BufferHandle;
  g: GLenum;
  h: GLsizei;
  i: number | ArrayBuffer | ArrayBufferView | undefined; // was GLvoid
  j: Target;
  k: LineCode;
  l: TechniqueId;
  m: RenderPass;
  n: RenderOrder;
  o: MeshGeometry;
  q: IndexedGeometry;
  r: TexturedMeshData;
  s: LitMeshData;
  t: ColorData;
  u: MaterialData;
  v: PolylineGeometry;
  w: EdgeGeometry;
  x: SilhouetteEdgeGeometry;
  y: PointStringGeometry;
  z: PointCloudGeometry;
  aa: ViewportQuadGeometry;
  ab: TexturedViewportQuadGeometry;
  ac: CompositeGeometry;
  ad: FeatureIndices;
  ae: ShaderProgramParams;
}

export class CachedGeometryCreateParams {
  a: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
}

export class IndexedGeometry extends CachedGeometry {
  a: BufferHandle;
  b: GLsizei;
} 

export class IndexedGeometryCreateParams extends CachedGeometryCreateParams {
  a: UInt32List; // ./GLESCommon.h
  b: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
}

export class MeshGeometry extends IndexedGeometry {
  a: FloatPreMulRgba;
  b: FeatureIndices;
  c: FillFlags; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  d: RenderPass;
  e: ColorData;
  f: MaterialData;
  g: GLES.Texture;
  h: NonUniformColor;
  i: SurfaceFlags;
  j: FeatureIndex.Type; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
}

export class MeshGeometryCreateParams extends IndexedGeometryCreateParams {
  a: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  b: ColorDef;
  c: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  d: FillFlags; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
}

export class TexturedMeshGeometry extends MeshGeometry {
  a: QBufferHandle2d; // ./Handle.ts
  b: RefCounted; // ?
  c: GLES.Texture;
  d: SurfaceFlags;
  e: TexturedMeshData;
}

export class TexturedMeshGeometryCreateParams extends MeshGeometryCreateParams {
  a: QPoint2dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  b: GLES.Texture;
}
export class LitMeshGeometry extends MeshGeometry {
  a: BufferHandle;
  b: NonUniformColor;
  c: LitMeshData;
}
export class LitMeshGeometryCreateParams extends MeshGeometryCreateParams {
  a: OctEncodedNormalList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  b: Material;
  c: ColorTable;
}
export class UnlitMeshGeometry extends MeshGeometry {
  ca: NonUniformColor;
}
export class UnlitMeshGeoemtryCreateParams extends MeshGeometryCreateParams {
  a: ColorTable;
}
export class TexturedLitMeshGeometry extends MeshGeometry {
  a: BufferHandle;
  b: BufferHandle2d; // ./Handle.ts
  c: RefCounted;
  f: LitMeshData;
  g: TexturedMeshData;
}
export class TexturedLitMeshGeometryCreateParams extends MeshGeometryCreateParams {
  a: OctEncodedNormalList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  b: QPoint2dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  c: GLES.Texture:
  d: Material;
}
export class PolylineGeometry extends IndexedGeometry {
  a: QBufferHandle3d; // ./Handle.ts
  b: BufferHandle;
  c: FeatureIndices;
  d: FloatPreMulRgba;
  e: NonUniformColor;
  f: LineCode;
  h: TechniqueId;
  i: RenderPass;
  j: RenderOrder:
  k: ColorData;
}
export class PolylineGeometryCreateParams extends IndexedGeometryCreateParams {
  a: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  b: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  c: ColorTable:
  d: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  e: LineCode;
  f: ColorTable;
  g: LinePixels;
}
export class EdgeGeometry extends IndexedGeometry {
  a: QBufferHandle3d; // ./Handle.ts
  b: BufferHandle;
  c: FeatureIndices;
  d: FloatPreMulRgba;
  e: NonUniformColor;
  f: LineCode;
  g: TechniqueId;
  h: RenderPass;
  i: RenderOrder:
  j: ColorData;
}
export class EdgeGeometryCreateParams extends IndexedGeometryCreateParams {
  a: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  b: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  c: ColorTable;
  d: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  e: LineCode;
  h: LinePixels;
}
export class SilhouetteEdgeGeometry extends EdgeGeometry {
  a: BufferHandle;
  b: SilhouetteEdgeGeometry;
  c: TechniqueId;
  d: RenderOrder;
}
export class SilhouetteEdgeGeometryCreateParams extends EdgeGeometryCreateParams {
  a: OctEncodedNormalPairList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  b: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  c: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  d: ColorTable;
  e: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  f: LinePixels;
}
export class PointStringGeometry extends IndexedGeometry {
  a: FeatureIndices;
  b: FloatPreMulRgba;
  c: NonUniformColor;
  d: TechniqueId;
  e: RenderPass;
  f: RenderOrder;
  g: ColorData;
}
export class PointStringGeometryCreateParams extends IndexedGeometryCreateParams {
  a: ColorTable;
  b: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  c: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
}
export class PointCloudGeometry extends CachedGeometry {
  a: BufferHandle;
  b: GLsizei;
  c: TechniqueId;
  d: RenderPass;
  e: RenderOrder;
}
export class PointCloudGeometryCreateParams extends CachedGeometryCreateParams {
  a: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  b: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
}
export class ViewportQuadGeometry extends IndexedGeometry {
  a: TechniqueId;
  b: RenderPass;
  c: RenderOrder;
}
export class TexturedViewportQuadGeometry extends ViewportQuadGeometry {
  a: QBufferHandle2d; // ./Handle.ts
  b: GLuint;
}
export class MultiTexturedViewportQuadGeometry extends TexturedViewportQuadGeometry {
  a: GLuint;
  b: TechniqueId;
  c: BufferHandle;
}
export class MultiTexturedViewportQuadGeometry extends TexturedViewportQuadGeometry {
  a: BufferHandle;
  b: GLuint;
  c: TechniqueId;
  d: GLESTexture;
  e: CompositeFlags;
}
export class CompositeGeometry extends MultiTexturedViewportQuadGeometry {
  a: GLuint;
  b: TechniqueId;
  c: BufferHandle;
  d: GLESTexture;
  e: CompositeFlags;
}
export class SingleTextureViewportQuadGeometry extends MultiTexturedViewportQuadGeometry {
  a: GLuint;
  b: TechniqueId;
  c: GLESTexture;
}
// DRAWCOMMAND
export class ShaderProgramParams {
  a: Target;
  b: Matrix4;
  c: RenderPass;
}
export class DrawParams extends ShaderProgramParams {
  a: CachedGeometry;
  b: Matrix4;
  c: RenderPass;
  d: ShaderProgramParams;
  e: Transform;
}
export class PrimitiveCounts {
  a: RenderOrder;
}
export const enum PushOrPop { Push, Pop }
export const enum OpCode { DrawBatchPrimitive, DrawOvrPrimitive, PushBranch, PopBranch }
export class BatchPrimitive {
  a: Primitive;
  d: GLESBatch;
}
export class OvrPrimitive {
  a: Primitive;
  b: OvrGraphicParams; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
}
export class DrawCommand {
  a: BatchPrimitive;
  b: OvrPrimitive;
  c: GLESBatch;
  d: OpCode;
  e: GLESBranch;
  f: PushOrPop;
  g: RenderPass;
  h: TechniqueId;
  i: LUTDimension;
  j: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  k: RenderOrder;
}
export class DrawCommands {
  a: DrawCommand;
  b: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  c: assert; // was BeAssert;
  d: PrimitiveCounts;
}
export class RenderCommands {
  a: Target;
  b: DrawCommands;
  c: BranchStack;
  d: GLESBatch;
  e: RenderPass;
  f: GraphicList;
  g: DecorationList;
  h: GLESGraphic;
  j: Graphic;
  k: DrawCommand;
  l: OvrGraphicParams; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  m: GLESBranch;
  n: assert; // was BeAssert;
  p: ViewFlags;
  q: Primitive;
  r: Render.Decorations;
  u: RenderCommands;
  v: PrimitiveCounts;
  w: CompositeFlags;
}
// EAGLDisplayContext
export class EAGLDisplayContext {}
export class EAGLDisplaySurface {
  a: EAGLDisplayContext;
  b: GLuint;
}
// EGLDisplayContext
export class EGLPlatformParameters {
  a: EGLint;
}
export class EGLDisplayContext {
  a: EGLConfig;
  b: EGLDisplay;
  c: EGLContext;
  d: EGLint;
  e: EGLBoolean;
  f: EGLPlatformParameters;
}
export class EGLDisplaySurface {
  a: EGLDisplayContext;
  b: EGLSurface; 
  c: GLuint;
  d: EGLNativeWindowType;
}
// FrameBuffer
export const enum BindState { Unbound, Bound, BoundWithAttachments, Suspended }
export class FramBuffer {
  a: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  c: GLESTexture;
  d: GLuint;
  e: BindState;
  f: GLenum;
  g: Render.Image;
  h: Point2d;
}
export class FrameBufferBinder {
  a: FrameBuffer;
}
// Graphic
export class ColorTable {
  a: Image;
  b: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  c: ColorDef;
  d: Image;
  e: LUTDimension;
  f: GLESTexture;
  g: Render.ColorIndex;
}
export class GLESGraphic extends Render.Graphic {
  a: RenderCommands;
  b: DrawCommands;
  c: Primitive;
  d: GLESBatch;
  e: DgnDb;
}
export class Uniform {
  a: FloatRgba;
  b: OvrFlags;
  c: OvrGraphicParams;
  d: FeatureTableCR;
  e: FeatureSymbologyOverrides;
  f: DgnElementIdSet;
  g: DgnElementId;
  h: DgnElementIdSet;
  i: FeatureSymbologyOverrides;
  j: DgnElementId;
}
export class NonUniform {
  a: LUTParams;
  b: FeatureTable;
  c: GLESTexture;
  d: FeatureSymbologyOverrides;
  e: DgnElementIdSet;
  f: DgnElementId;
  g: FeatureSymbologyOverrides;
}
export class FeatureOverrides {
  a: Uniform;
  b: NonUniform;
  c: GLES.Target;
  d: BeTimePoint;
  e: LUTDimension;
  f: FeatureTable;
  g: OvrGraphicParams;
  i: GLESTexture;
}
export class PickTable {
  a: LUTDimension;
  b: BeAssert;
  c: GLESTexture;
  d: FeatureTable;
  e: DgnElementId;
}
export class GLESBatch extends GLESGraphic {
  a: Graphic;
  b: FeatureTable;
  c: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  d: PickTable;
  f: FeatureTable;
  g: RenderCommands;
  h: GLES.Target;
  j: DrawCommands;
  l: BeAssert;
  m: FeatureOverrides;
}
export class GLESBranch extends GLESGraphic {
  a: GraphicBranch;
  b: Transform;
  c: ClipPlane;
  d: DgnDb;
  e: ClipVector;
  f: RenderCommands;
  g: DrawCommands;
  h: DMatrix4d;
  i: ViewFlags;
}
export class WorldDecorations extends GLESBranch {
  a: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  c: OvrGraphicParams;
  d: DgnDbR;
  e: ViewFlags;
  f: DecorationListCR;
}
export class GLESList extends GLESGraphic {
  a: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  b: Grarphic;
  c: DgnDb;
  d: RenderCommands;
  e: DrawCommands;
  f: GLESBatch;
}
export class PrimitiveParams {
  a: Point3dList;
  b: Point3d;
}
export class Primitive extends GLESGraphic {
  a: CachedGeometry;
  b: DgnDb;
  c: RenderPass;
  d: LUTDimension;
  e: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  f: Primitive;
  g: RenderOrder;
  h: TechniqueId;
  i: Target;
  j: ShaderProgramExecutorR;
  k: GLESBatch;
  l: RenderCommands;
  m: DrawCommands;
}
export class Features {
  a: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  b: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
}
export class IndexedPrimitiveParams extends PrimitiveParams {
  a: Features;
  b: ColorTable;
  c: Point3d;
  d: ColorIndex;
  e: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
}
export class IndexedPrimitive extends Primitive {
  a: DgnDb;
}
export class TriMeshParams extends IndexedPrimitiveParams {
  a: OctEncodedNormalList;
  b: Point2dList;
  c: Render.Texture;
  d: Render.Material;
  e: TriMeshArgs;
  f: CachedGeometry;
  g: FillFlags; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
}
export class TriMeshPrimitive extends INdexedPrimitive {
  a: TriMeshParams;
  b: FillFlags; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  c: RenderOrder;
  d: TriMeshArgs;
  e: DgnDb;
}
export const enum PolylineParam {
  kNone = 0,
  kSquare = 1*3,
  kMitter = 2*3,
  kMiterInsideOnly = 3*3,
  kJointBase = 4*3,
  kNegatePerp = 8*3,
  kNegateAlong = 16*3,
  kNoneAdjWt = 32*3,
}
export class Vertex {
  a: Point3d;
}
export class PolylineParams extends IndexedPrimitiveParams {
  a: PolylineParam;
  b: Vertex;
  c: IndexedPolylineArgs;
  d: CachedGeometry;
  e: Point3dList;
  f: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  g: Point3d;
}
export class PolylinePrimitive extends IndexedPrimitive {
  a: IndexedPolylineArgs;
  b: DgnDb;
  c: PolylineParams;
  d: Graphic;
  e: CachedGeometry;
  f: RenderOrder;
}
export class EdgeParams extends IndexedPrimitiveParams {
  a: Point3dList;
  b: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  c: LinePixels;
  d: ColorIndex;
  e: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  f: MeshEdgeArgs;
  g: QPoint3d;
  h: CachedGeometry;
}
export class EdgePrimitiveBase  extends IndexedPrimitive {
  a: DgnDb;
}
export class EdgePrimtive extends EdgePrimitiveBase {
  a: EdgeParams;
  b: CachedGeometry;
  c: BeAssert;
  d: MeshEdgeArgs;
  e: RenderOrder;
  f: DgnDb;
}
export class SilhouetteEdgeParams extends EdgeParams {
  a: OctEncodedNormalPairList;
  b: SilhouetteEdgeArgs;
  c: Point3d;
  d: OctEncodedNormalPair;
  e: CachedGeometry;
}
export class SilhouetteEdgePrimitive extends EdgePrimitiveBase {
  a: SilhouetteEdgeParams;
  b: RenderOrder;
  c: CachedGeometry;
  d: SilhouetteEdgeArgs;
  e: DgnDb;
  f: BeAssert;
}
export class PointStringParams extends IndexedPrimitiveParams {
  a: Point2dList;
  b: IndexedPolylineArgs;
  c: CachedGeometry;
}
export class PointStringPrimitive extends IndexedPrimitive {
  a: PointStringParams;
  b: CachedGeometry;
  c: RenderOrder;
  d: IndexedPolylineArgs;
  e: DgnDb;
}
export class PointCloudParams extends PrimitiveParams {
  a: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  b: PointCloudArgs;
  c: CachedGeometry;
}
export class PointCloudPrimitive extends Primitive {
  a: PointCloudParams;
  b: CachedGeometry;
  c: BeAssert;
  d: RenderOrder;
  e: PointCloudArgs;
  f: DgnDb;
}
// MATERIAL
export class Material extends Render.Material {
  a: FloatRgb;
  b: BeAssert;
}
// MATRIX
export namespace DMatrix4dUtils {
  export function frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): DMatrix4d;
  export function ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): DMatrix4d;
}
export namespace TransformUtils {
  export function lookAt(eye: DPoint3dCR, center: DPoint3dCR, up: DVec3dCR): Transform;
  export function LookIn(eye: DPoint3dCR, normalizedViewX: DVec3dCR, normalizedViewY: DVec3dCR, normalizedViewZ: DVec3dCR): Transform;
}
export class Matrix3 {
  a: RotMatrix;
}
export class Matrix4 {
  a: Point3d;
  b: Vec3d;
  c: Transform;
  d: Matrix4d;
  g: Transform;
  h: BSIRect;
}
// SceneCompositor
export class SceneCompositor {
  a: GLsizei;
  b: GLESTexture;
  c: FrameBuffer;
  e: CachedGeometry;
  f: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  g: Target;
  h: RenderCommands;
  i: RenderPass;
  i: GLint;
  j: BSIRect;
  k: ByteStream;
  l: RenderOrder;
  m: ViewRect;
  n: DgnElementId;
  o: BeFileName;
  p: IPixelDataBuffer;
  q: BSIRect;
  r: PixelData.Selector;
}
// ShaderUtils
export namespace ShaderUtils {
  export function compileShader(type: GLenum, source: string): GLuint;
  export function compileShaderFromFile(type: GLenum, sourcePath: string): GLuint;
  export function compileProgram(vsSource: string, fsSource: string): GLuint;
  export function compileProgramFromFiles(vsPath: string, fsPath: string): GLuint;
}
// ShaderBuilder
// Describes the data type of a shader program variable.
export const enum VariableType {
  Boolean, // bool
  Int, // int
  UInt, // uint
  Float, // float
  Vec2, // vec2
  Vec3, // vec3
  Vec4, // vec4
  Mat3, // mat3
  Mat4, // mat4
  Sampler2D, // sampler2D
  SamplerCube, //samplerCube
  COUNT
}
// Describes the qualifier associated with a shader program variable.
export const enum VariableScope {
  Local, // no qualifier
  Varying, // varying
  Uniform, // uniform
  Attribute, // attribute

  COUNT
}
// Describes the declared or undeclared precision of a shader program variable.
export const enum VariablePrecision {
  Default, // undeclared precision - variable uses the explicit or implicit precision default for its type
  Low, // lowp
  Medium, // mediump
  High, // highp

  COUNT
}
export const enum ShaderType {
  Fragment = 1 << 0,
  Vertex = 1 << 1,
  Both = Fragment | Vertex
}
export class ShaderVariable {
  a: T_AddVariableBinding;
  b: VariableType;
  c: VariableScope;
  d: VariablePrecision;
  e: BeAssert;
}
export class ShaderVariables {
  a: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  b: ShaderVariable;
  c: ShaderVariableCR;
  d: T_AddVariableBinding;
  e: VariableType;
  f: VariableScope;
  g: ShaderProgram;
}
// Describes the optional and required components which can be assembled into complete
export const enum VertexShaderComponent {
  // (Optional) Return true to discard this vertex before evaluating feature overrides etc, given the model-space position.
  // bool checkForEarlyDiscard(vec4 rawPos)
  CheckForEarlyDiscard,
  // (Optional) Compute feature overrides like visibility, rgb, transparency, line weight.
  ComputeFeatureOverrides,
  // (Optional) Return true if this vertex should be "discarded" (is not visible)
  // bool checkForDiscard()
  // If this returns true, gl_Position will be set to 0; presumably related vertices will also do so, resulting in a degenerate triangle.
  // If this returns true, no further processing will be performed.
  CheckForDiscard,
  // (Required) Return this vertex's position in clip space.
  // vec4 computePosition(vec4 rawPos)
  ComputePosition,
  // (Optional) Compute the clip distance to send to the fragment shader.
  // void calcClipDist(vec4 rawPos)
  CalcClipDist,
  // (Optional) Add the element id to the vertex shader.
  // void computeElementId()
  AddComputeElementId,

  COUNT
}
// Describes the optional and required components which can be assembled into complete
export const enum FragmentShaderComponent {
  // (Optional) Return true to immediately discard this fragment.
  // bool checkForEarlyDiscard()
  CheckForEarlyDiscard,
  // (Required) Compute this fragment's base color
  // vec4 computeBaseColor()
  ComputeBaseColor,
  // (Optional) Apply material overrides to base color
  // vec4 applyMaterialOverrides(vec4 baseColor)
  ApplyMaterialOverrides,
  // (Optional) Apply feature overrides to base color
  // vec4 applyFeatureColor(vec4 baseColor)
  ApplyFeatureColor,
  // (Optional) Adjust base color after material and/or feature overrides have been applied.
  // vec4 finalizeBaseColor(vec4 baseColor)
  FinalizeBaseColor,
  // (Optional) Return true if this fragment should be discarded
  // Do not invoke discard directly in your shader components - instead, return true from this function to generate a discard statement.
  // bool checkForDiscard(vec4 baseColor)
  CheckForDiscard,
  // (Optional) Return true if the alpha value is not suitable for the current render pass
  // bool discardByAlpha(float alpha)
  DiscardByAlpha,
  // (Optional) Apply lighting to base color
  // vec4 applyLighting(vec4 baseColor)
  ApplyLighting,
  // (Optional) Apply monochrome overrides to base color
  // vec4 applyMonochrome(vec4 baseColor)
  ApplyMonochrome,
  // (Optional) Apply white-on-white reversal to base color
  ReverseWhiteOnWhite,
  // (Optional) Apply flash hilite to lit base color
  // vec4 applyFlash(vec4 baseColor)
  ApplyFlash,
  // (Required) Assign the final color to gl_FragColor or gl_FragData
  // void assignFragData(vec4 baseColor)
  AssignFragData,
  // (Optional) Discard if outside any clipping planes
  // void applyClipping()
  ApplyClipping,

  COUNT
}
export class ShaderBuilder {
  a: FragmentShaderComponent;
  b: ShaderVariables;
  c: BeAssert;
  d: ShaderVariables;
  f: T_AddVariableBinding;
  g: VariablePrecision;
  h: VariableType;
}
export class FragmentShaderBuilder extends ShaderBuilder {
  a: FragmentShaderComponent;
}
export class ProgramBuilder {
  a: VertexShaderBuilder;
  b: FragmentShaderBuilder;
  c: GeometryType;
  d: VertexShaderBuilder;
  e: FragmentShaderBuilder;
  h: ShaderVariable;
  i: ShaderType;
  j: T_AddVariableBinding;
  k: VariableScope;
  l: ShaderProgram;
}
// ShaderProgram 
export class ProgramBinding {
  a: GLuint;
  b: Handle;
  c: UniformHandle; // ./Handle.ts
  d: BeAssert;
}
export class ShaderBinding extends ProgramBinding {
  a: UniformHandle; // ./Handle.ts
  b: ShaderProgramParams;
  c: T_Use;
}
export class GraphicBinding extends ProgramBinding {
  a: T_Bind;
  b: GraphicBinding;
  c: DrawParams;
  d: AttributeHandle; // ./Handle.ts
  e: BeAssert;
  f: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  g: ShaderBinding;
  h: GraphicBinding;
}
export const enum CompileStatus { Success, Failure, Uncompiled, }
export class ShaderProgram {
  a: ShaderProgramExecutor;
  b: CompileStatus;
  c: GLuint;
  d: ShaderBindings;
  e: GraphicBindings;
  f: GeometryType;
  g: DrawParams;
  h: ShaderProgramParams;
  i: ShaderBinding;
  j: GraphicBinding;
}
export class ShaderProgramExecutor {
  a: ShaderProgram;
  b: ShaderProgramParams;
  c: Target;
  d: RenderPass;
  g: Transform;
  h: ViewFlags;
  i: FeatureOverrides;
  j: PickTable;
  k: DrawParams;
  n: GLESBranch;
}
// ShaderSource
export namespace ShaderSource {
  export function addViewport(ShaderBuilderR): void; // uniform vec4 u_viewport // the dimensions of the viewport
  export function addViewportTransformation(ShaderBuilderR): void; // uniform mat4 u_viewportTransformation // transforms NDC to window coordinates
  export function addRenderPass(ShaderBuilderR): void; // uniform float u_renderPass; // RenderPass value indicating current render pass plus kRenderPass_* constants
  export function addFrustumPlanes(ShaderBuilderR): void; // uniform vec4 u_frustumPlanes; // { top, bottom, left, right }
  export function addFrustum(ShaderBuilderR): void; // uniform vec3 u_frustum; // { near, far, type } type:0=2d,1=ortho,2=perspective; plus kFrustumType_* constants
  export class Lighting {
    a: ShaderProgram;
    b: FragmentShaderBuilder;
    c: ProgramBuilder;
  }
}
// System
export class Capabilities {}
export class Light extends Render.Light {
  a: Lighting;
  b: ColorDef;
  c: Vec3d;
  d: Point3d;
}
export class ViewportQuad {
  a: Point3dList;
}
export class TexturedViewportQuad extends ViewportQuad {
  a: Point2dList;
}
export const enum ContextState { Uninitialized, Success, Error };
export class System extends Render.System {
  a: ContextState;
  b: DisplayContext;
  c: DisplaySurface;
  d: Techniques;
  e: ContextState;
  f: GLESTexture;
  g: RenderState;
  h: Capabilities;
  i: TexturedViewportQuad;
  j: BoundFrameBufferStack;
  k: GLESCubemap;
  l: Render.Target;
  m: Render.Texture;
  n: Render.Material;
  o: Render.GraphicalBuilder;
  p: Render.Graphic;
  q: Graphic;
  e: Light;
  s: Vec3d;
  t: Point;
  u: DisplayContext;
  v: Techniques;
  w: DgnDb;
  x: ClipVector;
  y: Transform;
  aa: FeatureTable;
  ab: GraphicBranch;
  ac: PointCloudPrimitive;
  ad: TriMeshPrimitive;
  ae: PointCloudArgs;
  af: MeshEdgeArgs;
  ag: TriMeshArgs;
  ai: SilhouetteEdgeArgs;
  aj: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  ak: lighting;
  al: DisplayContext;
  am: Techniques;
  an: RenderState;
  ao: GLESTexture;
}
    // static void OnTextureAllocated(GLESTexture const& texture);
    // static void OnTextureFreed(GLESTexture const& texture);
    // static void OnBufferAllocated(BufferHandleCR buffer);
    // static void OnBufferFreed(BufferHandleCR buffer);
//=======================================================================================
// Target.h
//=======================================================================================
export const enum FrustumUniformType {
  TwoDee, Orthographic, Perspective
}
export const enum FrustumUniformPlane {
  kTop,
  kBottom,
  kLeft,
  kRight,
  kNear,
  kFar,
  kType,
  kCOUNT
}
export class FrustumUnifoms {
  a: FrustumUniformPlane;
  b: FrustumUniformType;
}
export class GLESClips {
  a: ClipVector;
  b: ClipPlane;
  c: Transform;
}
export class ShaderLight {
  a: Target;
  b: Vec3d;
}
export class RenderScope {
  a: GLES.Target;
}
export class Target extends Render.Target {
  a: System;
  b: Render.TileSizeAdjuster;
  c: ColorDef;
  d: HiliteSettings;
  e: GLESClips;
  f: Matrix4;
  g: Transform;
  h: RenderCommands;
  l: SceneCompositor;
  m: Point3d;
  n: BranchStack;
  o: Frustum;
  p: bset;
  q: GLESBatch;
  r: BeTimePoint;
  s: FeatureOverrides;
  t: FeatureSymbologyOverrides;
  u: OvrGraphicParams;
  v: DgnElementIdSet;
  w: PickTable;
  x: FrustumUniforms;
  y: DgnElementId;
  z: BranchState;
  aa: WorldDecorations;
  ab: EdgeOverrides;
  ac: Vec3d;
  ad: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  ae: GLES.Texture;
  ef: Image;
  eg: IPixelDataBuffer;
  eh: PixelData;
  ai: BSIRect;
  aj: BentleyStatus;
  ak: StopWatch;
  al: Plan;
  am: GraphicList;
  an: ClipVector;
  ao: Point2d;
  ap: WChar;
  aq: SceneLights;
  ar: Render.Device;
  as: Techniques;
  at: ViewFlags;
  au: GLESBranch;
  ax: BranchState;
  az: BeAssert;
  ba: GLESBatch;
  bb: EdgeOverrides;
  bc: RenderPass;
  bd: LineCode;
  be: FloatPreMulRgba;
}
export class OnScreenTarget extends Target {
  a: BSIRect;
  b: FrameBuffer;
  c: Render.Device;
  d: Render.Target;
  e: System;
}
export class OffScreenTarget extends Target {
  a: FrameBuffer;
  b: BSIRect;
  c: System;
  d: Render.Device;
  e: Render.Target;
}
// Technique 
export class ShaderPrograms {
  a: ShaderProgram;
  b: BeAssert;
}
export class Technique {
  a: ShaderProgram;
  b: ShaderPrograms;
  c: TechniqueFlags;
}
export class SingularTechnique extends Technique {
  a: ShaderProgram;
  b: TechniqueFlags;
  c: ShaderPrograms;
}
export class VariedTechnique extends Technique {
  a: ShaderProgram;
  b: TechniqueFlags;
  c: ProgramBuilder;
  d: FeatureDimensions;
  e: WithClipVolume;
  f: FSOptions;
  g: FragmentShaderComponent;
  h: VertexShaderComponent;
  k: ShaderSource;
  l: FeatureSymbology;
}
export const enum ShaderIndex {
  kOpaque = 0,
  kTranslucent = 2,
  kOverrides = 4,
  kMonochrome = 8,
  kFeature = 16,
  kHilite = NumFeatureVariants(kFeature),
  kClip = kHilite + NumHiliteVariants()
}
export class SurfaceTechnique extends VariedTechnique {
  a: ShaderIndex;
  b: TechniqueFlags;
  c: WithClipVolume;
  d: LUTDimension;
  e: ShaderSource;
  f: FeatureDimensions;
  g: FSOptions;
}
export class PolylineTechnique extends VariedTechnique {
  a: ShaderIndex;
  b: TechniqueFlags;
  c: ShaderSource;
  d: FeatureDimensions;
  e: LUTDimension;
  f: FSOptions;
}
export class EdgeTechnique extends VariedTechnique {
  a: ShaderIndex;
  b: TechniqueFlags;
  c: FeatureDimensions;
  d: ShaderSource;
  e: FSOptions;
}
export class SilhouetteEdgeTechnique extends EdgeTechnique {}
export class PointStringTechnique extends VariedTechnique {
  a: ShaderIndex;
  b: TechniqueFlags;
  c: WithClipVolume;
  d: LUTDimension;
  e: ShaderSource;
  f: FSPOptions;
}
export class PointCloudTechnique extends VariedTechnique {
  a: TechniqueFlags;
  b: WithClipVolume;
  c: FragmentShaderComponent;
  d: ShaderSource;
}
export class Techniques {
  a: bvector; // Bentley/PublicAPI/Bentley/bvector.h
  b: Technique;
  c: TechniqueId;
  d: Target;
  e: RenderPass;
  f: DrawParams;
}
// Texture
export const enum TextureFlags {
  None = 0,
  UseMipMaps = 1 << 0,
  Interpolate = 1 << 1,
  PreserveData = 1 << 2,
}
export const enum GLESTextureInternalFormat {
//   Rgb             = GL_RGB,
//         Rgba            = GL_RGBA,
// #if defined(GLES3_CONFORMANT)
//         Rgba32f         = GL_RGBA32F,
//         Depth24Stencil8 = GL_DEPTH24_STENCIL8,
//         R8              = GL_R8,
//         DepthComponent24= GL_DEPTH_COMPONENT24,
// #else
//         DepthStencil    = GL_DEPTH_STENCIL,
//         Luminance       = GL_LUMINANCE,
//         DepthComponent  = GL_DEPTH_COMPONENT,
// #endif
}
export const enum GLESTextureFormat {
  // Rgb             = GL_RGB,
  //         Rgba            = GL_RGBA,
  //         DepthStencil    = GL_DEPTH_STENCIL,
  //         DepthComponent  = GL_DEPTH_COMPONENT,
  // #if defined(GLES3_CONFORMANT)
  //         Red             = GL_RED,
  // #else
  //         Luminance       = GL_LUMINANCE,
  // #endif
}
export const enum GLESTextureDataType {
  Float           = GL_FLOAT,
  UnsignedByte    = GL_UNSIGNED_BYTE,
  UnsignedInt24_8 = GL_UNSIGNED_INT_24_8,
  UnsignedInt     = GL_UNSIGNED_INT,
}
export class GLESTextureCreateParams {
  a: GLESTextureFormat;
  b: GLESTextureDataType;
  c: ByteStream;
  d: Point2d;
  e: GLESTextureInternalFormat;
  f: WrapMode;
  g: TextureFlags;
  h: Render.Image;
}
export class GLESTextureUpdater {
  a: ByteStream;
  b: OvrFlags;
}
export class GLESTexture {
  a: GLESTextureCreateParams;
  b: GLuint;
  c: TextureUnit;
  d: UniformHandle; // ./Handle.ts
  e: GLsizei;
  f: GLESTextureFormat;
  g: GLESTextureDataType;
  h: GLESTextureUpdater;
  i: ImageUpdater;
}
export class ImageTexture extends GLESTexture {
  a: Image;
  b: Render.Texture;
  c: IsTranslucent;
}
export class ColorTexture extends GLESTexture {
  a: GLsizei;
  b: GLESTextureInternalFormat;
  c: GLESTextureDataType;
  d: IsTranslucent;
}
export class Texture extends Render.Texture {
  a: ImageTexture;
  b: ImageSource;
  c: IsTranslucent;
  d: GLESTextureCreateParams;
  e: UnformHandle; // ./Handle.ts
  f: TextureUnit;
  g: BeAssert;
  h: Image;
}
export class GLESCubeMap {
  a: GLsizei;
  b: GLint;
  c: CLenum;
  d: ByteStream;
  e: UniformHandle; // ./Handle.ts
  f: TextureUnit;
  g: GLuint;
}
